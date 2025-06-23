'use client';

import * as React from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/timepicker'; // your TimePicker
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/redux/hooks/typedHooks';
import { selectCurrentFirm } from '@/redux/features/firm';
import { ModeToggle } from '@/components/toogle';
import { Scale } from 'lucide-react';

const BookingPage = () => {
  const firm = useAppSelector(selectCurrentFirm);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');

  const formattedDate = selectedDate ? format(selectedDate, 'PPP') : 'Pick a date';

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <ModeToggle />
 <div className='flex items-center flex-col'>
       <Scale size={30}/>
      <h1 className="text-2xl font-semibold text-center">{firm?.name}</h1>
      <p className="text-center text-muted-foreground">{firm?.description}</p>
 </div>

      {/* Calendar Popover */}
      <div>
        <label className="block mb-1 font-medium">Select Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              {formattedDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              disabled={(date) => {
                const day = format(date, 'EEE').toLowerCase();
                return !(firm!.weeklyHours?.[day]?.length > 0);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div>
        <label className="block mb-1 font-medium">Select Time</label>
        <TimePicker
          value={selectedTime}
          onChange={setSelectedTime}
          placeholder="Select time"
          disabled={!selectedDate}
        />
      </div>

      {/* Confirm Button */}
      <Button disabled={!selectedDate || !selectedTime} className="cursor-pointer w-full">
        Book Appointment
      </Button>
    </div>
  );
};

export default BookingPage;
