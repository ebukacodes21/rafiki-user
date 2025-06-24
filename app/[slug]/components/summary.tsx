"use client";

import * as React from "react";
import { format } from "date-fns";

type TimeRange = {
  open: string;
  close: string;
};

type DateOverride = {
  date: string;
  isClosed: boolean;
  timeRanges: TimeRange[];
};

type WeeklyHours = Record<string, TimeRange[]>;

type OpenHoursSummaryProps = {
  date: Date | undefined;
  dateOverrides: DateOverride[];
  weeklyHours: WeeklyHours;
};

const normalize = (date: Date | string) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const OpenHoursSummary: React.FC<OpenHoursSummaryProps> = ({
  date,
  dateOverrides,
  weeklyHours,
}) => {
  if (!date) return null;

  const dateTs = normalize(date);

  const override = dateOverrides.find(
    (d) => normalize(d.date) === dateTs
  );

  if (override) {
    if (override.isClosed)
      return <p className="text-red-600 font-medium">Closed on this date</p>;

    return (
      <p className="text-sm text-muted-foreground">
        Open hours (override):{" "}
        {override.timeRanges.map((r) => `${r.open} - ${r.close}`).join(", ")}
      </p>
    );
  }

  const dayKey = format(date, "EEE").toUpperCase(); 
  const hours = weeklyHours[dayKey];

  if (!hours || hours.length === 0) {
    return <p className="text-red-600 font-medium">Closed on this day</p>;
  }

  return (
    <p className="text-sm text-muted-foreground">
      Open hours: {hours.map((r) => `${r.open} - ${r.close}`).join(", ")}
    </p>
  );
};
