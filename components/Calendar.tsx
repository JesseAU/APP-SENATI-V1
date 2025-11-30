import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import es from 'date-fns/locale/es';

interface CalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({ selectedDate, onSelectDate }) => {
  const today = new Date();
  // Calculate start of week (Monday) manually to avoid startOfWeek import issues
  const currentDay = today.getDay();
  // 0 = Sun, 1 = Mon, ...
  // If Mon(1), subtract 0. If Sun(0), subtract 6.
  const daysToSubtract = (currentDay + 6) % 7;
  const startDate = addDays(today, -daysToSubtract);
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="flex justify-between items-center px-4 py-3 overflow-x-auto no-scrollbar gap-2">
        {weekDays.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className={`flex flex-col items-center justify-center min-w-[3.5rem] py-2 rounded-xl transition-all ${
                isSelected
                  ? 'bg-senati-blue text-white shadow-md transform scale-105'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="text-[10px] uppercase font-bold mb-1">
                {format(date, 'EEE', { locale: es })}
              </span>
              <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                {format(date, 'd')}
              </span>
              {isToday && !isSelected && (
                <div className="h-1 w-1 bg-senati-blue rounded-full mt-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};