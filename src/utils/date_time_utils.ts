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


  export { formatTimeDisplay, formatDisplayDate, ddmmyyyy };


