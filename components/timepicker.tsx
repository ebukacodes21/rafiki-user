'use client';

import * as React from 'react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, index) => {
  const hours = Math.floor(index / 4);
  const minutes = (index % 4) * 15;
  const time = new Date();
  time.setHours(hours, minutes, 0, 0);
  return format(time, 'HH:mm');
});

type TimePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select time',
  className,
  disabled,
}) => {
  return (
 <Select
  value={value}
  onValueChange={onChange}
  disabled={disabled}
>
  <SelectTrigger
    className={cn("w-28", className, "appearance-none pr-2")}
    disabled={disabled}
  >
    <SelectValue placeholder={placeholder} />
  </SelectTrigger>
  <SelectContent>
    {TIME_OPTIONS.map((time) => (
      <SelectItem key={time} value={time}>
        {time}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

  );
};
