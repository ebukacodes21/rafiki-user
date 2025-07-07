"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import { selectCurrentFirm } from "@/redux/features/firm";
import { ModeToggle } from "@/components/toogle";
import { ScaleIcon } from "@heroicons/react/24/outline";
import {
  apiCall,
  firmToClientTime,
  formatError,
  generateTimeSlots,
  minutesToTimeString,
  timeStringToMinutes,
} from "@/utils/helper";
import { OpenHoursSummary } from "./components/summary";
import BookingForm from "./components/booking";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";

export default function BookingPage() {
  const firm = useAppSelector(selectCurrentFirm);
  const firmTimeZone = firm?.availability?.timeZone || "UTC";
  const [clientTimeZone, setClientTimeZone] = useState(() => {
    if (Intl?.DateTimeFormat) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return "UTC";
  });

  const [zones, setZones] = useState<string[]>([]);
  useEffect(() => {
    if (Intl?.supportedValuesOf) {
      setZones(Intl.supportedValuesOf("timeZone"));
    } else {
      setZones([
        "Africa/Lagos",
        "Europe/London",
        "America/New_York",
        "Asia/Tokyo",
      ]);
    }
  }, []);

  const weeklyHours = useMemo(() => firm?.availability?.weeklyHours || {}, [firm?.availability?.weeklyHours]);
  const dateOverrides = useMemo(() => firm?.dateOverrides || [], [firm?.dateOverrides]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // store all booked slots fetched once per firm
  const [allBookedSlots, setAllBookedSlots] = useState<
    { start: string; end?: string }[]
  >([]);

  // fetch all confirmed booked slots on firm.id change
  useEffect(() => {
    if (!firm?.id) {
      setAllBookedSlots([]);
      return;
    }

    const fetchSlots = async () => {
      const res = await apiCall(
        `/api/get-booked-slots?firmId=${firm.id}`,
        "GET"
      );

      if (res === null) {
        setAllBookedSlots([]);
        return;
      }

      if (res?.name === "AxiosError") {
        toast.error(formatError(res));
        setAllBookedSlots([]);
        return;
      }

      setAllBookedSlots(res);
    };

    fetchSlots();
  }, [firm?.id]);

  // derive booked slot times (HH:mm) for the selected date and client timezone
  const bookedSlots = useMemo(() => {
    if (!selectedDate) return [];

    // normalize selectedDate to midnight
    const startOfSelectedDate = new Date(selectedDate);
    startOfSelectedDate.setHours(0, 0, 0, 0);

    const endOfSelectedDate = new Date(startOfSelectedDate);
    endOfSelectedDate.setDate(endOfSelectedDate.getDate() + 1);

    return allBookedSlots
      .filter((slot) => {
        const utcStart = new Date(slot.start);
        return utcStart >= startOfSelectedDate && utcStart < endOfSelectedDate;
      })
      .map((slot) => {
        const utc = new Date(slot.start);
        const clientTime = toZonedTime(utc, clientTimeZone);
        return format(clientTime, "HH:mm");
      });
  }, [allBookedSlots, selectedDate, clientTimeZone]);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [duration, setDuration] = useState(0);

  const normalizeDate = (d: Date) => {
    const dd = new Date(d);
    dd.setHours(0, 0, 0, 0);
    return dd.getTime();
  };

  const isDateDisabled = (d: Date) => {
    const todayTs = normalizeDate(new Date());
    const dTs = normalizeDate(d);
    if (dTs < todayTs) return true;

    const override = dateOverrides.find(
      (o) => normalizeDate(new Date(o.date)) === dTs
    );
    if (override?.isClosed) return true;

    const dayKey = format(d, "EEE").toUpperCase();
    return !weeklyHours[dayKey]?.length;
  };

  const firmRanges = useMemo(() => {
    if (!selectedDate) return [];
    const dayKey = format(selectedDate, "EEE").toUpperCase();
    const override = dateOverrides.find(
      (o) => normalizeDate(new Date(o.date)) === normalizeDate(selectedDate)
    );
    const ranges = override?.isClosed
      ? []
      : override?.timeRanges || weeklyHours[dayKey] || [];
    return ranges;
  }, [selectedDate, weeklyHours, dateOverrides]);

  const clientRanges = useMemo(() => {
    if (!selectedDate) return [];
    return firmRanges.map((r) => ({
      open: firmToClientTime(
        selectedDate,
        r.open,
        firmTimeZone,
        clientTimeZone
      ),
      close: firmToClientTime(
        selectedDate,
        r.close,
        firmTimeZone,
        clientTimeZone
      ),
    }));
  }, [selectedDate, firmRanges, firmTimeZone, clientTimeZone]);

  const availableStarts = useMemo(() => {
    if (!selectedDate) return [];
    return clientRanges
      .flatMap((r) => generateTimeSlots(r.open, r.close, 30))
      .filter((t) => !bookedSlots.includes(t));
  }, [clientRanges, bookedSlots, selectedDate]);

  const availableEnds = useMemo(() => {
    if (!start) return [];
    const startMins = timeStringToMinutes(start);
    const matchingRange = clientRanges.find((r) => {
      const openM = timeStringToMinutes(r.open);
      const closeM = timeStringToMinutes(r.close);
      return startMins >= openM && startMins < closeM;
    });
    if (!matchingRange) return [];

    const ends: string[] = [];
    for (
      let t = startMins + 30, cm = timeStringToMinutes(matchingRange.close);
      t <= cm;
      t += 30
    ) {
      const s = minutesToTimeString(t);
      if (!bookedSlots.includes(s)) ends.push(s);
    }
    return ends;
  }, [start, clientRanges, bookedSlots]);

  useEffect(() => {
    if (!(start && end)) return setDuration(0);
    const dur = timeStringToMinutes(end) - timeStringToMinutes(start);
    setDuration(dur > 0 ? dur : 0);
  }, [start, end]);

  const fee = useMemo(() => {
    if (!firm?.consultationFee?.enabled) return "";
    if (firm.consultationFee.unit === "flat rate")
      return `${
        firm.consultationFee.currency
      } ${firm.consultationFee.amount.toLocaleString()}`;
    if (duration > 0)
      return `${firm.consultationFee.currency} ${(
        (duration / 60) *
        firm.consultationFee.amount
      ).toLocaleString()}`;
    return "";
  }, [duration, firm]);

  const handleBook = () => {
    if (!selectedDate || !start || !end) return;
    setShowForm(true);
  };

  return (
    <div className="py-2 px-3">
      <ModeToggle />
      <div className="flex flex-col md:flex-row justify-between max-w-5xl mx-auto mt-10 gap-10">
        <div className="max-w-md space-y-6">
          <div className="flex flex-col items-center gap-1">
            <ScaleIcon className="h-10 w-10 text-primary mb-2" />
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-semibold text-center">
                {firm?.name}
              </h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-sky-500"
                aria-label="Verified firm"
              >
                <path d="M22 12l-2.122 2.122.376 2.753-2.754-.376L16 22l-2.122-2.122L12 22l-1.878-2.122L8 22l-1.5-2.5-2.754.376.376-2.754L2 12l2.122-2.122L3.746 7.125l2.754.376L8 2l2.122 2.122L12 2l1.878 2.122L16 2l1.5 2.5 2.754-.376-.376 2.754L22 12zm-12 2l6-6-1.414-1.414L10 11.172l-1.586-1.586L7 11l3 3z" />
              </svg>
            </div>
            <p className="text-center text-muted-foreground">
              {firm?.description}
            </p>
          </div>

          <OpenHoursSummary
            date={selectedDate}
            weeklyHours={weeklyHours}
            dateOverrides={dateOverrides}
            timeZone={firmTimeZone}
          />

          <div className="space-y-2">
            <Label>Your timezone:</Label>
            <Select value={clientTimeZone} onValueChange={setClientTimeZone}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Pick timezone" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-auto">
                {zones.map((tz) => {
                  const now = new Date();
                  const offset = new Intl.DateTimeFormat("en-US", {
                    timeZone: tz,
                    timeZoneName: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(now);
                  return (
                    <SelectItem key={tz} value={tz}>
                      {offset} — {tz}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start cursor-pointer text-left md:w-full",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => {
                  setSelectedDate(d);
                  setStart("");
                  setEnd("");
                }}
                disabled={isDateDisabled}
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-2">
            <Select
              value={start}
              onValueChange={(v) => {
                setStart(v);
                setEnd("");
              }}
              disabled={!selectedDate}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Start" />
              </SelectTrigger>
              <SelectContent>
                {availableStarts.map((t) => (
                  <SelectItem
                    key={t}
                    value={t}
                    disabled={bookedSlots.includes(t)} // disable booked slots
                    className={
                      bookedSlots.includes(t)
                        ? "text-gray-400 cursor-not-allowed"
                        : ""
                    }
                  >
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={end} onValueChange={setEnd} disabled={!start}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="End" />
              </SelectTrigger>
              <SelectContent>
                {availableEnds.map((t) => (
                  <SelectItem
                    key={t}
                    value={t}
                    disabled={bookedSlots.includes(t)} // disable booked slots
                    className={
                      bookedSlots.includes(t)
                        ? "text-gray-400 cursor-not-allowed"
                        : ""
                    }
                  >
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p>
            Duration: <strong>{duration > 0 ? `${duration} min` : "--"}</strong>
          </p>
          {fee && <p className="text-primary font-semibold">Fee: {fee}</p>}

          <Button
            className="cursor-pointer"
            onClick={handleBook}
            disabled={!start || !end}
          >
            Book Consultation
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              key="booking-form"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 80 }}
              className="w-full md:max-w-md"
            >
              <BookingForm
                selectedDate={selectedDate!}
                selectedTime={`${start} - ${end}`}
                startTime={start}
                endTime={end}
                duration={duration}
                fee={fee}
                onClose={() => setShowForm(false)}
                timeZone={clientTimeZone}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
