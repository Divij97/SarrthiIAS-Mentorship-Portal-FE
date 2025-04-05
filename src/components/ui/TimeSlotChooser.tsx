import { formatTimeSlot, timeSlots, weekDays } from "@/utils/date-time-utils";
import { useState } from "react";
import { FormData } from "@/types/multistep-form";
import { PreferredSlot } from "@/types/mentee";

interface TimeSlotChooserProps {
    formData: FormData;
    handleChange: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

// Map time slots to enum keys - these should be the enum keys, not the display values
const slotMap: Record<string, string> = {
    [timeSlots.MORNING]: PreferredSlot.MORNING,
    [timeSlots.EVENING]: PreferredSlot.EVENING
};

export const TimeSlotChooser = ({ formData, handleChange }: TimeSlotChooserProps) => {
    // Get the first slot from the array, or empty string if array is empty
    // const [uniformSlot, setUniformSlot] = useState(formData.preferredSlotsOnWeekdays[0] || '');

    // const handleUniformSlotChange = (slot: string) => {
    //     setUniformSlot(slot);
    //     // Create an array with the selected slot
    //     const e = {
    //         target: {
    //             value: [slot], // Store as array with single value
    //             name: 'preferredSlotsOnWeekdays'
    //         }
    //     } as unknown as React.ChangeEvent<HTMLInputElement>;
    //     handleChange('preferredSlotsOnWeekdays')(e);
    // };
    
    // return (
    //     <div className="space-y-4">
    //         <label className="block text-sm font-medium text-gray-700">
    //             Preferred Time Slots
    //         </label>

    //         <div className="mt-4 space-y-2">
    //             <div className="flex items-center space-x-4">
    //                 <input
    //                     type="radio"
    //                     id="uniform-morning-slot"
    //                     checked={uniformSlot === timeSlots.MORNING}
    //                     onChange={() => handleUniformSlotChange(timeSlots.MORNING)}
    //                     className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
    //                 />
    //                 <label htmlFor="uniform-morning-slot" className="text-sm text-gray-700">
    //                     {formatTimeSlot(timeSlots.MORNING)}
    //                 </label>
    //             </div>
    //             <div className="flex items-center space-x-4">
    //                 <input
    //                     type="radio"
    //                     id="uniform-evening-slot"
    //                     checked={uniformSlot === timeSlots.EVENING}
    //                     onChange={() => handleUniformSlotChange(timeSlots.EVENING)}
    //                     className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
    //                 />
    //                 <label htmlFor="uniform-evening-slot" className="text-sm text-gray-700">
    //                     {formatTimeSlot(timeSlots.EVENING)}
    //                 </label>
    //             </div>
    //             <div className="flex items-center space-x-4">
    //                 <input
    //                     type="radio"
    //                     id="uniform-all-slot"
    //                     checked={uniformSlot === timeSlots.ALL}
    //                     onChange={() => handleUniformSlotChange(timeSlots.ALL)}
    //                     className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
    //                 />
    //                 <label htmlFor="uniform-all-slot" className="text-sm text-gray-700">
    //                     {formatTimeSlot(timeSlots.ALL)}
    //                 </label>
    //             </div>
    //         </div>
    //     </div>
    // );

    return (<div></div>);
};