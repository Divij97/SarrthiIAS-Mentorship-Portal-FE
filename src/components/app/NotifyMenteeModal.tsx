import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StrippedDownMentee } from '@/types/mentee';
import { sendEmailToMentor } from '@/services/mentors';
import { toast } from 'react-hot-toast';
import { BackendError } from '@/types/error';

interface NotifyMenteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentees: StrippedDownMentee[];
  authHeader: string;
}

export default function NotifyMenteeModal({ isOpen, onClose, mentees, authHeader }: NotifyMenteeModalProps) {
  const [selectedMenteeId, setSelectedMenteeId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const selectedMentee = mentees.find(m => m.p === selectedMenteeId);
    if (!selectedMentee) return;

    try {
      setIsLoading(true);
      await sendEmailToMentor(selectedMentee, authHeader);
      toast.success('Email has been sent to the mentee successfully');
      onClose();
    } catch (error) {
      toast.error(`Failed to send email to mentee, errorCode: ${(error as BackendError)?.errorCode || 'UNKNOWN'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMenteeId(e.target.value);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Notify Mentee
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4">
            <label htmlFor="mentee" className="block text-sm font-medium text-gray-700">
              Select Mentee
            </label>
            <select
              id="mentee"
              value={selectedMenteeId}
              onChange={handleMenteeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            >
              <option value="">Select a mentee</option>
              {mentees.map((mentee) => (
                <option key={mentee.p} value={mentee.p}>
                  {mentee.n}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedMenteeId || isLoading}
              className="inline-flex justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 