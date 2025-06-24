"use client";

import * as React from "react";
import { format } from "date-fns";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export const TimezoneInfo = () => {
  const [timezone, setTimezone] = React.useState("");
  const [currentTime, setCurrentTime] = React.useState("");

  React.useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(format(now, "hh:mm aaaaa'm'"));
    };

    updateTime(); // run once immediately
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
 <div className="rounded-md border p-4 bg-muted/50">
  <p className="text-sm font-medium text-foreground mb-2">Time Zone</p>
  <div className="flex items-center gap-3 text-sm text-muted-foreground">
    <GlobeAltIcon className="h-5 w-5 text-primary" />
    <div>
      <p>
        <strong>{timezone}</strong>
      </p>
      <p className="text-xs text-muted-foreground">
        Current time: <strong>{currentTime}</strong>
      </p>
    </div>
  </div>
</div>
  );
};
