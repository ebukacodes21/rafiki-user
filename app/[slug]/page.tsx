"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/timepicker";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import { selectCurrentFirm } from "@/redux/features/firm";
import { ModeToggle } from "@/components/toogle";
import { Scale } from "lucide-react";
import { generateTimeSlots } from "@/utils/helper";
import { OpenHoursSummary } from "./components/summary";
import { TimezoneInfo } from "./components/timezone";

const BookingPage = () => {
  const firm = useAppSelector(selectCurrentFirm);
  const weeklyHours = React.useMemo(() => firm?.weeklyHours || {}, [firm]);
  const dateOverrides = React.useMemo(() => firm?.dateOverrides || [], [firm]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const formattedDate = selectedDate
    ? format(selectedDate, "PPP")
    : "Pick a date";

  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const normalize = (date: Date | string) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const disabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateTs = normalize(date);
    const todayTs = normalize(today);

    if (dateTs < todayTs) return true;
    const override = dateOverrides.find((d) => normalize(d.date) === dateTs);
    if (override) return override.isClosed;

    // fallback to weekly schedule
    const dayKey = format(date, "EEE").toUpperCase();
    const dayHours = weeklyHours[dayKey];
    return !(dayHours && dayHours.length > 0);
  };

  const availableTimeSlots = React.useMemo(() => {
    if (!selectedDate) return [];
    const dateTs = normalize(selectedDate);
    const override = dateOverrides.find((d) => normalize(d.date) === dateTs);

    if (override) {
      if (override.isClosed) return [];
      return override.timeRanges.flatMap((r) =>
        generateTimeSlots(r.open, r.close)
      );
    }

    const dayKey = format(selectedDate, "EEE").toUpperCase();
    const hours = weeklyHours[dayKey] || [];
    return hours.flatMap((r) => generateTimeSlots(r.open, r.close));
  }, [selectedDate, weeklyHours, dateOverrides]);

  return (
    <div className="max-w-md px-5 md:px-0 mx-auto mt-10 space-y-6">
      <ModeToggle />
      <div className="flex items-center flex-col gap-1">
        <Scale size={30} className="text-primary mb-2" />

        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-semibold text-center">{firm?.name}</h1>
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

        <p className="text-center text-muted-foreground">{firm?.description}</p>
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
            {formattedDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            initialFocus
            disabled={disabled}
            required={true}
          />
        </PopoverContent>
      </Popover>

      <OpenHoursSummary
        date={selectedDate}
        dateOverrides={dateOverrides}
        weeklyHours={weeklyHours}
      />

      <TimePicker
        value={selectedTime}
        onChange={setSelectedTime}
        placeholder="Select time"
        disabled={!selectedDate || availableTimeSlots.length === 0}
        options={availableTimeSlots}
      />

      {selectedDate && availableTimeSlots.length === 0 && (
        <p className="text-sm text-red-500 mt-1">
          No available appointment times on this date.
        </p>
      )}

      <Button
        disabled={!selectedDate || !selectedTime}
        className="cursor-pointer md:w-full"
      >
        Book Appointment
      </Button>

      <TimezoneInfo />
    </div>
  );
};

export default BookingPage;
