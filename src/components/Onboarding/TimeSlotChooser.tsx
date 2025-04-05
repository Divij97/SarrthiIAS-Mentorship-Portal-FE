import { FormData } from '@/types/onboarding';

interface TimeSlotChooserProps {
  formData: FormData;
  handleArrayChange: (field: keyof FormData, value: any) => void;
}

export default function TimeSlotChooser({ formData, handleArrayChange }: TimeSlotChooserProps) {
  const timeSlots = [
    { id: 'MORNING', label: 'Morning (9 AM - 6 PM)' },
    { id: 'EVENING', label: 'Evening (6 PM - 9 PM)' },
    { id: 'ALL', label: 'No Preference' }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Preferred Time Slot
      </label>
      <div className="space-y-2">
        {timeSlots.map((slot) => (
          <div key={slot.id} className="flex items-center">
            <input
              id={slot.id}
              name="preferredTimeSlot"
              type="radio"
              value={slot.id}
              checked={formData.preferredTimeSlot === slot.id}
              onChange={(e) => handleArrayChange('preferredTimeSlot', e.target.value)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
            />
            <label htmlFor={slot.id} className="ml-3 block text-sm text-gray-700">
              {slot.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
} 