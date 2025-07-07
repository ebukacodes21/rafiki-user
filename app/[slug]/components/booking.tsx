"use client";

import * as React from "react";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormRegister } from "react-hook-form";

import {
  UserIcon,
  EnvelopeIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { BookingSchema } from "@/schema";
import { apiCall, formatError } from "@/utils/helper";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import { selectCurrentFirm } from "@/redux/features/firm";
import { fromZonedTime } from "date-fns-tz";

type BookingFormValues = z.infer<typeof BookingSchema>;

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  startTime: string;
  endTime: string;
  duration: number;
  fee: string;
  onClose: () => void;
  timeZone: string;
}

const InputField = <TFieldValues extends Record<string, any>>({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  register,
  name,
  error,
}: {
  label: string;
  icon: React.ElementType;
  type?: string;
  placeholder: string;
  register: UseFormRegister<TFieldValues>;
  name: keyof TFieldValues;
  error?: string;
}) => {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </Label>
      <div className="flex items-center border rounded-md px-3 py-2">
        <Icon className="h-5 w-5 mr-2 text-gray-400" />
        {type === "textarea" ? (
          <Textarea
            {...register(name as any)}
            placeholder={placeholder}
            className="w-full border-none outline-none text-sm"
            rows={4}
          />
        ) : (
          <Input
            type={type}
            {...register(name as any)}
            placeholder={placeholder}
            className="w-full border-none outline-none text-sm"
          />
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

const BookingForm: React.FC<BookingFormProps> = ({
  startTime,
  endTime,
  selectedDate,
  selectedTime,
  duration,
  fee,
  onClose,
  timeZone,
}) => {
  const firm = useAppSelector(selectCurrentFirm);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(BookingSchema),
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    const datePart = format(selectedDate, "yyyy-MM-dd");

    // combine date and local start/end times
    const localStart = `${datePart}T${startTime}:00`;
    const localEnd = `${datePart}T${endTime}:00`;

    // convert to UTC from user's timezone
    const startUTC = fromZonedTime(localStart, timeZone);
    const endUTC = fromZonedTime(localEnd, timeZone);

    const payload = {
      ...data,
      scheduledFor: startUTC.toISOString(),
      endTime: endUTC.toISOString(), 
      timeRange: selectedTime,
      duration,
      fee,
      firmId: firm?.id,
      timeZone,
    };

    const result = await apiCall("/api/confirm-consultation", "POST", payload);
    console.log(result);
    if (result.name === "AxiosError") {
      setIsSubmitting(false);
      toast.error(formatError(result));
      return;
    }

    setIsSubmitting(false);
    setSuccess(true); 
    toast.success(result);
  };

  if (success) {
    return (
      <Card className="px-5 py-4">
        <h2 className="text-xl font-semibold mb-4">🎉 Booking Confirmed!</h2>
        <p>
          Your consultation is booked for{" "}
          <strong>
            {format(selectedDate, "PPP")} at {selectedTime}
          </strong>
          .<br />
          Consultation details will be sent to your email.
        </p>
        <p className="mt-2">⏱ Duration: {duration} minutes</p>
        <p>💵 Fee: {fee ? fee : "Free Consultation"}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setSuccess(false);
            onClose();
          }}
        >
          Close
        </Button>
      </Card>
    );
  }

  return (
    <Card className="px-5 py-6">
      <CardHeader>
        <CardTitle>Confirm Booking</CardTitle>
        <CardDescription>Please fill in your details below</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>
              <strong>Date:</strong> {format(selectedDate, "PPP")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            <span>
              <strong>Time:</strong> {selectedTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            <span>
              <strong>Duration:</strong> {duration} minutes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="h-5 w-5" />
            <span>
              <strong>Fee:</strong> {fee ? fee : "Free Consultation"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Full Name"
            icon={UserIcon}
            name="name"
            placeholder="Your full name"
            register={register}
            error={errors.name?.message}
          />

          <InputField
            label="Email Address"
            icon={EnvelopeIcon}
            name="email"
            placeholder="you@example.com"
            register={register}
            error={errors.email?.message}
          />

          <InputField
            label="Additional Notes"
            icon={ChatBubbleOvalLeftEllipsisIcon}
            name="notes"
            type="textarea"
            placeholder="Add any context or notes to help the firm prepare better"
            register={register}
            error={errors.notes?.message}
          />

          <div className="flex justify-between items-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
