'use client';

import { useState } from 'react';
import { sampleMentors } from '@/data/mentors';
import { Mentor } from '@/types/mentor';
import MentorListItem from '@/components/Admin/MentorListItem';

export default function MentorsPage() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    // TODO: Implement mentor details view or edit functionality
    console.log('Selected mentor:', mentor);
  };

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

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            Total Mentors: {sampleMentors.length}
          </div>
          {/* TODO: Add search and filter options here */}
        </div>

        <div className="space-y-4">
          {sampleMentors.map((mentor) => (
            <MentorListItem
              key={mentor.phone}
              mentor={mentor}
              onSelect={handleMentorSelect}
            />
          ))}
        </div>

        {sampleMentors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No mentors found</p>
          </div>
        )}
      </div>
    </div>
  );
} 