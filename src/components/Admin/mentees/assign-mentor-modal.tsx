import { StrippedDownMentor } from "@/types/mentor";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";



interface AssignMentorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (mentorPhone: string) => void;
    mentors: StrippedDownMentor[];
    loading: boolean;
}

export function AssignMentorModal({ isOpen, onClose, onSubmit, mentors, loading }: AssignMentorModalProps) {
    const [selectedMentor, setSelectedMentor] = useState<string>('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Assign Mentor</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Mentor
                        </label>
                        <select
                            value={selectedMentor}
                            onChange={(e) => setSelectedMentor(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                            disabled={loading}
                        >
                            <option value="">Select a mentor</option>
                            {mentors.map(mentor => (
                                <option key={mentor.phone} value={mentor.phone}>
                                    {mentor.displayName} ({mentor.phone})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onSubmit(selectedMentor)}
                            disabled={!selectedMentor || loading}
                            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Assigning...' : 'Assign Mentor'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}