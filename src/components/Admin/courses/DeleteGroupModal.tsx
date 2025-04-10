'use client';

import { Dialog } from '@/components/ui/Dialog';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
  isLoading: boolean;
}

export function DeleteGroupModal({ isOpen, onClose, onConfirm, groupName, isLoading }: DeleteGroupModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Group"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-red-600">
          <TrashIcon className="h-5 w-5" />
          <p className="text-sm font-medium">Are you sure you want to delete this group?</p>
        </div>
        <p className="text-sm text-gray-500">
          This action cannot be undone. Please make sure that there are no mentees assigned to this group.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-3 py-1.5 text-sm font-medium text-white rounded-md ${
              isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoading ? 'Deleting...' : 'Delete Group'}
          </button>
        </div>
      </div>
    </Dialog>
  );
} 