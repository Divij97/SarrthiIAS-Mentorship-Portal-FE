'use client';

import { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isToday } from 'date-fns';
import { Meeting } from '@/types/meeting';
import { formatTimeDisplay } from '@/utils/date-time-utils';

interface WeekCalendarProps {
  meetings: Meeting[];
  onMeetingClick?: (meeting: Meeting) => void;
}

export default function WeekCalendar({ meetings, onMeetingClick }: WeekCalendarProps) {
  // Get the current week's start date (Monday)
  const thisWeekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
  
  // Get the next week's start date
  const nextWeekStart = useMemo(() => addWeeks(thisWeekStart, 1), [thisWeekStart]);
  
  // State to track which week is currently displayed (0 = this week, 1 = next week)
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  
  // Calculate the current week start based on the index
  const currentWeekStart = useMemo(() => 
    currentWeekIndex === 0 ? thisWeekStart : nextWeekStart
  , [currentWeekIndex, thisWeekStart, nextWeekStart]);
  
  const weekDays = useMemo(() => {
    return eachDayOfInterval({
      start: currentWeekStart,
      end: endOfWeek(currentWeekStart, { weekStartsOn: 1 })
    });
  }, [currentWeekStart]);

  // Navigate to next week (only if currently on this week)
  const nextWeek = () => {
    if (currentWeekIndex === 0) {
      setCurrentWeekIndex(1);
    }
  };

  // Navigate to previous week (only if currently on next week)
  const prevWeek = () => {
    if (currentWeekIndex === 1) {
      setCurrentWeekIndex(0);
    }
  };

  // Check if we're viewing this week
  const isCurrentWeek = currentWeekIndex === 0;
  
  // Check if we're viewing next week
  const isNextWeek = currentWeekIndex === 1;

  const weekTitle = useMemo(() => {
    const weekStart = format(currentWeekStart, 'MMM d');
    const weekEnd = format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy');
    return `${weekStart} - ${weekEnd}`;
  }, [currentWeekStart]);

  // Group meetings by day
  const meetingsByDay = useMemo(() => {
    const grouped: Record<string, Meeting[]> = {};
    
    weekDays.forEach((day: Date) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      grouped[dateStr] = meetings.filter(meeting => {
        const meetingDate = meeting.date;
        return meetingDate === dateStr;
      });
    });
    
    return grouped;
  }, [meetings, weekDays]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {isCurrentWeek ? 'This Week' : 'Next Week'}
          </h2>
          <p className="text-sm text-gray-500">{weekTitle}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={prevWeek}
            disabled={isCurrentWeek}
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isCurrentWeek 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={nextWeek}
            disabled={isNextWeek}
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isNextWeek 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day: Date) => (
          <div 
            key={day.toString()} 
            className={`py-3 text-center text-sm font-medium ${
              isToday(day) ? 'bg-orange-50' : ''
            }`}
          >
            <div className="text-gray-500">{format(day, 'EEE')}</div>
            <div className={`mt-1 ${isToday(day) ? 'text-orange-600' : 'text-gray-900'}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 h-96 overflow-y-auto">
        {weekDays.map((day: Date) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayMeetings = meetingsByDay[dateStr] || [];
          
          return (
            <div 
              key={day.toString()} 
              className={`border-r min-h-full ${
                isToday(day) ? 'bg-orange-50' : ''
              }`}
            >
              <div className="h-full p-2 space-y-2">
                {dayMeetings.length > 0 ? (
                  dayMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={() => onMeetingClick && onMeetingClick(meeting)}
                      className="bg-orange-100 border-l-4 border-orange-500 p-2 rounded text-sm cursor-pointer hover:bg-orange-200 transition-colors"
                    >
                      <div className="font-medium text-gray-900 break-words">{meeting.title}</div>
                      <div className="text-xs text-gray-600">
                        {formatTimeDisplay(meeting.startTime)} - {formatTimeDisplay(meeting.endTime)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs text-gray-400">No meetings</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 