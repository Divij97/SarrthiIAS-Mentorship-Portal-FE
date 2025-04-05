import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { RecurrenceType } from '@/types/session';
import { DayOfWeek } from '@/types/mentor';
import { StrippedDownMentee } from '@/types/mentee';

interface AddScheduleForMenteeProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    menteeUsername: string;
    menteeFullName: string;
    startTime: string;
    endTime: string;
    recurrenceType: RecurrenceType;
    firstSessionDate: string;
    dayOfWeek: DayOfWeek;
  }) => void;
  mentee: StrippedDownMentee;
}

export const AddScheduleForMentee = ({ isOpen, onClose, onSubmit, mentee }: AddScheduleForMenteeProps) => {
  const [formData, setFormData] = useState({
    menteeUsername: mentee.phone, // Using phone as username
    menteeFullName: mentee.name,
    startTime: '',
    endTime: '',
    recurrenceType: RecurrenceType.WEEKLY,
    firstSessionDate: '',
    dayOfWeek: DayOfWeek.MONDAY
  });

  const convertToDisplayFormat = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDayOfWeekFromDate = (dateString: string): DayOfWeek => {
    if (!dateString) return DayOfWeek.MONDAY;
    const date = new Date(dateString);
    const days = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY
    ];
    return days[date.getDay()];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const dayOfWeek = getDayOfWeekFromDate(newDate);
    setFormData({ ...formData, firstSessionDate: newDate, dayOfWeek });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert the date from yyyy-mm-dd to dd/mm/yyyy
    const [year, month, day] = formData.firstSessionDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    onSubmit({
      ...formData,
      firstSessionDate: formattedDate
    });
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Schedule for Mentee">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mentee Name</label>
          <input
            type="text"
            value={formData.menteeFullName}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">First Session Date</label>
          <input
            type="date"
            value={formData.firstSessionDate}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Selected date: {convertToDisplayFormat(formData.firstSessionDate)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Day of Week</label>
          <input
            type="text"
            value={formData.dayOfWeek.charAt(0) + formData.dayOfWeek.slice(1).toLowerCase()}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            Day of week is automatically set based on the selected date
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recurrence Type</label>
          <select
            value={formData.recurrenceType}
            onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value as RecurrenceType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            required
          >
            {Object.values(RecurrenceType).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700"
          >
            Create Schedule
          </Button>
        </div>
      </form>
    </Dialog>
  );
}; 