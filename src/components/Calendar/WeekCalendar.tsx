'use client';

import { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon, UserIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isToday, addDays, isSameDay } from 'date-fns';
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
  
  // Get the week after next week's start date
  const weekAfterNextStart = useMemo(() => addWeeks(nextWeekStart, 1), [nextWeekStart]);
  
  // State to track which week is currently displayed (0 = this week, 1 = next week, 2 = week after next)
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  // For mobile view: track which day is selected (0-6 for Monday-Sunday)
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    // Default to today's index within the week (0 for Monday, 6 for Sunday)
    const today = new Date();
    const mondayStart = startOfWeek(today, { weekStartsOn: 1 });
    // Find days between Monday and today
    for (let i = 0; i < 7; i++) {
      if (isSameDay(addDays(mondayStart, i), today)) {
        return i;
      }
    }
    return 0; // Default to Monday if something goes wrong
  });
  
  // Calculate the current week start based on the index
  const currentWeekStart = useMemo(() => {
    switch (currentWeekIndex) {
      case 0:
        return thisWeekStart;
      case 1:
        return nextWeekStart;
      case 2:
        return weekAfterNextStart;
      default:
        return thisWeekStart;
    }
  }, [currentWeekIndex, thisWeekStart, nextWeekStart, weekAfterNextStart]);
  
  const weekDays = useMemo(() => {
    return eachDayOfInterval({
      start: currentWeekStart,
      end: endOfWeek(currentWeekStart, { weekStartsOn: 1 })
    });
  }, [currentWeekStart]);

  // Navigate to next week (only if not on the last week)
  const nextWeek = () => {
    if (currentWeekIndex < 2) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  // Navigate to previous week (only if not on the first week)
  const prevWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  // For mobile view: navigate to next day
  const nextDay = () => {
    if (selectedDayIndex < 6) {
      setSelectedDayIndex(selectedDayIndex + 1);
    } else if (currentWeekIndex < 2) {
      // If at the end of the week and not on the last week, move to next week
      setCurrentWeekIndex(currentWeekIndex + 1);
      setSelectedDayIndex(0); // Set to Monday of next week
    }
  };

  // For mobile view: navigate to previous day
  const prevDay = () => {
    if (selectedDayIndex > 0) {
      setSelectedDayIndex(selectedDayIndex - 1);
    } else if (currentWeekIndex > 0) {
      // If at the start of the week and not on the first week, move to previous week
      setCurrentWeekIndex(currentWeekIndex - 1);
      setSelectedDayIndex(6); // Set to Sunday of previous week
    }
  };

  // Check which week we're viewing
  const isCurrentWeek = currentWeekIndex === 0;
  const isNextWeek = currentWeekIndex === 1;
  const isWeekAfterNext = currentWeekIndex === 2;

  const weekTitle = useMemo(() => {
    const weekStart = format(currentWeekStart, 'MMM d');
    const weekEnd = format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy');
    return `${weekStart} - ${weekEnd}`;
  }, [currentWeekStart]);

  // For mobile: get current selected day
  const selectedDay = useMemo(() => weekDays[selectedDayIndex], [weekDays, selectedDayIndex]);
  
  // For mobile: format the selected day
  const selectedDayTitle = useMemo(() => {
    return format(selectedDay, 'EEEE, MMMM d');
  }, [selectedDay]);

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

  // For mobile: get meetings for the selected day
  const selectedDayMeetings = useMemo(() => {
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    return meetingsByDay[dateStr] || [];
  }, [meetingsByDay, selectedDay]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Desktop Week View Header - Hidden on mobile */}
      <div className="hidden md:flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {isCurrentWeek ? 'This Week' : isNextWeek ? 'Next Week' : 'Week After Next'}
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
            disabled={isWeekAfterNext}
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isWeekAfterNext 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Day View Header - Only visible on mobile */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {isToday(selectedDay) ? 'Today' : selectedDayTitle}
          </h2>
          <p className="text-xs text-gray-500">
            {isCurrentWeek ? 'This Week' : isNextWeek ? 'Next Week' : 'Week After Next'}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={prevDay}
            disabled={currentWeekIndex === 0 && selectedDayIndex === 0}
            className={`p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              currentWeekIndex === 0 && selectedDayIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={nextDay}
            disabled={currentWeekIndex === 2 && selectedDayIndex === 6}
            className={`p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              currentWeekIndex === 2 && selectedDayIndex === 6
                ? 'text-gray-300 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Day Selector - Small date pills */}
      <div className="md:hidden overflow-x-auto border-b">
        <div className="flex p-2 space-x-2">
          {weekDays.map((day: Date, index: number) => (
            <button
              key={day.toString()}
              onClick={() => setSelectedDayIndex(index)}
              className={`flex-shrink-0 flex flex-col items-center p-2 rounded-lg ${
                selectedDayIndex === index
                  ? 'bg-orange-100 text-orange-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-xs font-medium">{format(day, 'EEE')}</span>
              <span className={`text-sm mt-1 font-semibold ${isToday(day) ? 'text-orange-600' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Week View - Days of the week header */}
      <div className="hidden md:grid grid-cols-7 border-b">
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

      {/* Desktop Week View - Calendar grid */}
      <div className="hidden md:grid grid-cols-7 min-h-[400px] max-h-[800px] overflow-y-auto">
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
                      className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                        (meeting as any).isGroupSession 
                          ? 'bg-blue-100 border-l-4 border-blue-500 hover:bg-blue-200' 
                          : 'bg-orange-100 border-l-4 border-orange-500 hover:bg-orange-200'
                      }`}
                    >
                      <div className="font-medium text-gray-900 break-words">{meeting.title}</div>
                      <div className="text-xs text-gray-600">
                        {formatTimeDisplay(meeting.startTime)} - {formatTimeDisplay(meeting.endTime)}
                      </div>
                      <div className="mt-1 text-xs text-gray-600">
                        Occurence Type: {meeting.sessionType === 'AD_HOC' ? 'Once' : 'Scheduled'}
                      </div>
                      {(meeting as any).isGroupSession && (
                        <div className="mt-1 text-xs text-blue-600">
                          Group Session
                        </div>
                      )}
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

      {/* Mobile Day View - List of meetings for selected day */}
      <div className="md:hidden min-h-[400px] max-h-[800px] overflow-y-auto">
        <div className={`h-full p-4 ${isToday(selectedDay) ? 'bg-orange-50' : ''}`}>
          {selectedDayMeetings.length > 0 ? (
            <div className="space-y-3">
              {selectedDayMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  onClick={() => onMeetingClick && onMeetingClick(meeting)}
                  className="bg-orange-100 border-l-4 border-orange-500 p-3 rounded-md text-sm cursor-pointer hover:bg-orange-200 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-base mb-1">{meeting.title}</div>
                  <div className="flex items-center text-xs text-gray-600 mb-1">
                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                    {formatTimeDisplay(meeting.startTime)} - {formatTimeDisplay(meeting.endTime)}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 mb-1">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                    Frequency: {meeting.sessionType === 'AD_HOC' ? 'Once' : 'Weekly/Bi-Weekly'}
                  </div>
                  {meeting.menteeFullName && (
                    <div className="flex items-center text-xs text-gray-600">
                      <UserIcon className="h-3.5 w-3.5 mr-1" />
                      {meeting.menteeFullName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <CalendarIcon className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-400">No meetings scheduled</p>
              <p className="text-xs text-gray-400 mt-1">for {format(selectedDay, 'EEEE')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 