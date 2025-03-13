import { DayOfWeek } from "@/types/mentor";

const timeSlots = {
    MORNING: '9AM_6PM',
    EVENING: '6PM_9PM'
  } as const;

  const answerWritingLevels = {
    NEEDS_SUPPORT: 'BEGINNER',
    AVERAGE: 'INTERMEDIATE',
    FAIRLY_GOOD: 'ADVANCED'
  } as const;


const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

const formatTimeSlot = (slot: string): string => {
    return slot === timeSlots.MORNING ? '9:00 AM - 6:00 PM' : '6:00 PM - 9:00 PM';
  };

// Helper function to format time from 24h format (HH:MM:SS) to 12h format
const formatTimeDisplay = (timeString: string): string => {
    // Handle ISO date strings or simple time strings
    const timePart = timeString.includes('T')
        ? timeString.split('T')[1].substring(0, 5) // Extract HH:MM from ISO string
        : timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS

    const [hours, minutes] = timePart.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Helper function to format date as "13th March" or "1st April"
const formatDisplayDate = (dateString: string): string => {
    // Parse the date (assuming format is DD/MM/YYYY)
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    // Get day with ordinal suffix
    const dayNum = date.getDate();
    let suffix = 'th';
    if (dayNum === 1 || dayNum === 21 || dayNum === 31) suffix = 'st';
    else if (dayNum === 2 || dayNum === 22) suffix = 'nd';
    else if (dayNum === 3 || dayNum === 23) suffix = 'rd';

    // Format the date
    return `${dayNum}${suffix} ${date.toLocaleString('en-US', { month: 'long' })}`;
};

const ddmmyyyy = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// Format date as DD/MM/YYYY
const formatDateKey = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Helper function to get the next occurrence of a day of week
const getNextDayOfWeek = (dayOfWeek: DayOfWeek): Date => {
    const today = new Date();
    const daysOfWeek = {
        [DayOfWeek.MONDAY]: 1,
        [DayOfWeek.TUESDAY]: 2,
        [DayOfWeek.WEDNESDAY]: 3,
        [DayOfWeek.THURSDAY]: 4,
        [DayOfWeek.FRIDAY]: 5,
        [DayOfWeek.SATURDAY]: 6,
        [DayOfWeek.SUNDAY]: 0
    };

    const targetDay = daysOfWeek[dayOfWeek];
    const currentDay = today.getDay();

    // Calculate days to add
    const daysToAdd = (targetDay + 7 - currentDay) % 7;

    // Create a new date for the next occurrence
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);

    return nextDate;
};

export {
    weekDays,
    timeSlots, 
    answerWritingLevels,
    formatTimeSlot, 
    formatTimeDisplay, 
    formatDisplayDate, 
    ddmmyyyy, 
    formatDateKey, 
    getNextDayOfWeek 
};


