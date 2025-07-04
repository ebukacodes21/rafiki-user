"use client";

import * as React from "react";
import { format } from "date-fns";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TimezoneProp = {
  timeZone: string;
  setTimeZone: (value: string) => void
  zones: string[]
}

export const TimezoneInfo: React.FC<TimezoneProp> = ({ timeZone, setTimeZone, zones }) => {
  return (
 <div className="rounded-md border p-4 bg-muted/50">
    <Label className="text-sm font-medium">Time Zone</Label>
          <div className="w-full">
            <Select value={timeZone} onValueChange={setTimeZone}>
              <SelectTrigger className="">
                <SelectValue placeholder="Choose time zone" />
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
</div>
  );
};
