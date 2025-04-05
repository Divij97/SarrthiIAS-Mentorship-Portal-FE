import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MergeGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupName: string) => void;
  selectedGroups: string[];
  groups: any[];
  isLoading?: boolean;
}

export default function MergeGroupModal({
  isOpen,
  onClose,
  onSubmit,
  selectedGroups,
  groups,
  isLoading = false
}: MergeGroupModalProps) {
  const [groupName, setGroupName] = useState('');

  if (!isOpen) return null;

  const selectedGroupsData = groups.filter(group => selectedGroups.includes(group.groupId));
  const suggestedName = `Merged Group (${selectedGroupsData.map(g => g.groupFriendlyName).join(' + ')})`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(groupName || suggestedName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Merge Groups</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
              New Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={suggestedName}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Suggested name: {suggestedName}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {isLoading ? 'Merging...' : 'Merge Groups'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 