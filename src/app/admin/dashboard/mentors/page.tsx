'use client';

import { useState } from 'react';
import { sampleMentors } from '@/data/mentors';
import { Mentor } from '@/types/mentor';
import MentorListItem from '@/components/Admin/MentorListItem';
import { TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MentorsPage() {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMentors, setSelectedMentors] = useState<Set<string>>(new Set());
  const [mentors, setMentors] = useState(sampleMentors);

  const handleMentorSelect = (mentor: Mentor) => {
    if (!isSelectionMode) {
      return;
    }
    setSelectedMentors(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(mentor.phone)) {
        newSelected.delete(mentor.phone);
      } else {
        newSelected.add(mentor.phone);
      }
      return newSelected;
    });
  };

  const handleMentorEdit = (mentor: Mentor) => {
    if (isSelectionMode) return; // Disable edit in selection mode
    // TODO: Implement edit functionality
    console.log('Edit mentor:', mentor);
  };

  const handleDeleteSelected = () => {
    // Filter out selected mentors
    const newMentors = mentors.filter(mentor => !selectedMentors.has(mentor.phone));
    setMentors(newMentors);
    setSelectedMentors(new Set());
    setIsSelectionMode(false);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedMentors(new Set());
  };

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

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            Total Mentors: {mentors.length}
          </div>
          {/* TODO: Add search and filter options here */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <MentorListItem
              key={mentor.phone}
              mentor={mentor}
              onSelect={handleMentorSelect}
              onEdit={handleMentorEdit}
              isSelected={isSelectionMode && selectedMentors.has(mentor.phone)}
            />
          ))}
        </div>

        {mentors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No mentors found</p>
          </div>
        )}
      </div>
    </div>
  );
} 