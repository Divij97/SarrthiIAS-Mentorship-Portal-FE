export type TimeSlot = 'MORNING' | 'EVENING' | 'ALL';

export interface FormData {
  preferredTimeSlot: TimeSlot;
  // ... other form fields
} 