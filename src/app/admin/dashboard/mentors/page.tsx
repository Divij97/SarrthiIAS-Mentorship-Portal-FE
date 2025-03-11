'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mentor } from '@/types/mentor';
import MentorListItem from '@/components/Admin/MentorListItem';
import { useAdminStore } from '@/stores/admin/store';
import { TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MentorsPage() {
  const router = useRouter();
  const { adminData } = useAdminStore();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMentors, setSelectedMentors] = useState<Set<string>>(new Set());

  if (!adminData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const handleMentorSelect = (mentor: Mentor) => {
    if (isSelectionMode) {
      setSelectedMentors(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(mentor.email)) {
          newSelected.delete(mentor.email);
        } else {
          newSelected.add(mentor.email);
        }
        return newSelected;
      });
    } else {
      router.push(`/admin/dashboard/mentors/${encodeURIComponent(mentor.email)}/details`);
    }
  };

  const handleMentorEdit = (mentor: Mentor) => {
    if (isSelectionMode) return; // Disable edit in selection mode
    // TODO: Implement edit functionality
    console.log('Edit mentor:', mentor);
  };

  const handleDeleteSelected = () => {
    // TODO: Implement delete functionality
    console.log('Delete selected mentors:', Array.from(selectedMentors));
    setSelectedMentors(new Set());
    setIsSelectionMode(false);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedMentors(new Set());
  };

  if (!adminData.mentors || adminData.mentors.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Mentors Management</h2>
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            onClick={() => {/* TODO: Implement add mentor functionality */}}
          >
            Add New Mentor
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No mentors found</p>
          <p className="text-sm text-gray-400">Add mentors to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900">Mentors Management</h2>
          {isSelectionMode ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Selected: {selectedMentors.size}
              </span>
              <button
                onClick={handleDeleteSelected}
                disabled={selectedMentors.size === 0}
                className={`flex items-center px-3 py-1.5 rounded-md transition-colors duration-200 ${
                  selectedMentors.size === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
              <button
                onClick={exitSelectionMode}
                className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSelectionMode(true)}
              className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              Select Mentors
            </button>
          )}
        </div>
        <button
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          onClick={() => {/* TODO: Implement add mentor functionality */}}
        >
          Add New Mentor
        </button>
      </div>

      <div className="space-y-4">
        {adminData.mentors.map((mentor) => (
          <MentorListItem
            key={mentor.email}
            mentor={mentor}
            onSelect={() => handleMentorSelect(mentor)}
            onEdit={() => handleMentorEdit(mentor)}
            isSelected={isSelectionMode && selectedMentors.has(mentor.email)}
          />
        ))}
      </div>
    </div>
  );
} 