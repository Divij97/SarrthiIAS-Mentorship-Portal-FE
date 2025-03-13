import { formatTimeSlot, timeSlots, weekDays } from "@/utils/date-time-utils";
import { useState } from "react";
import { FormData } from "@/types/multistep-form";

interface TimeSlotChooserProps {
    formData: FormData;
    handleArrayChange: (field: 'preferredSlotsOnWeekdays') => (value: string[]) => void;
}

export const TimeSlotChooser = ({ formData, handleArrayChange }: TimeSlotChooserProps) => {
    const [useUniformSlot, setUseUniformSlot] = useState(true);
  const [uniformSlot, setUniformSlot] = useState('');

  const handleUniformSlotChange = (slot: string) => {
    setUniformSlot(slot);
    const newSlots = weekDays.map(() => slot);
    handleArrayChange('preferredSlotsOnWeekdays')(newSlots);
  };

  const handleDayWiseSlotChange = (day: number, slot: string) => {
    const newSlots = [...formData.preferredSlotsOnWeekdays];
    newSlots[day] = slot;
    handleArrayChange('preferredSlotsOnWeekdays')(newSlots);
  };

  const handleSlotTypeChange = (isUniform: boolean) => {
    setUseUniformSlot(isUniform);
    // Reset slots when switching between uniform and day-wise
    handleArrayChange('preferredSlotsOnWeekdays')([]);
    setUniformSlot('');
  };
    
    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                Preferred Time Slots
            </label>

            <div className="space-y-2">
                <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="uniform-slot"
                        checked={useUniformSlot}
                        onChange={() => handleSlotTypeChange(true)}
                        className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="uniform-slot" className="text-sm text-gray-700">
                        Same time slot for all weekdays
                    </label>
                </div>
                <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="day-wise-slot"
                        checked={!useUniformSlot}
                        onChange={() => handleSlotTypeChange(false)}
                        className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="day-wise-slot" className="text-sm text-gray-700">
                        Different time slots for each day
                    </label>
                </div>
            </div>

            {useUniformSlot ? (
                <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-4">
                        <input
                            type="radio"
                            id="uniform-morning-slot"
                            checked={uniformSlot === timeSlots.MORNING}
                            onChange={() => handleUniformSlotChange(timeSlots.MORNING)}
                            className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="uniform-morning-slot" className="text-sm text-gray-700">
                            {formatTimeSlot(timeSlots.MORNING)}
                        </label>
                    </div>
                    <div className="flex items-center space-x-4">
                        <input
                            type="radio"
                            id="uniform-evening-slot"
                            checked={uniformSlot === timeSlots.EVENING}
                            onChange={() => handleUniformSlotChange(timeSlots.EVENING)}
                            className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="uniform-evening-slot" className="text-sm text-gray-700">
                            {formatTimeSlot(timeSlots.EVENING)}
                        </label>
                    </div>
                </div>
            ) : (
                <div className="mt-4 space-y-4">
                    {weekDays.map((day, index) => (
                        <div key={`${day}-container`} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">{day}</label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="radio"
                                    id={`${day}-morning-slot`}
                                    checked={formData.preferredSlotsOnWeekdays[index] === timeSlots.MORNING}
                                    onChange={() => handleDayWiseSlotChange(index, timeSlots.MORNING)}
                                    className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <label htmlFor={`${day}-morning-slot`} className="text-sm text-gray-700">
                                    {formatTimeSlot(timeSlots.MORNING)}
                                </label>
                                <input
                                    type="radio"
                                    id={`${day}-evening-slot`}
                                    checked={formData.preferredSlotsOnWeekdays[index] === timeSlots.EVENING}
                                    onChange={() => handleDayWiseSlotChange(index, timeSlots.EVENING)}
                                    className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <label htmlFor={`${day}-evening-slot`} className="text-sm text-gray-700">
                                    {formatTimeSlot(timeSlots.EVENING)}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}