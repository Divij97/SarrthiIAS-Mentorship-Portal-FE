'use client';

import { useState } from 'react';
import { StrippedDownMentor } from '@/types/mentor';
import MentorListItem from '@/components/Admin/MentorListItem';
import { TrashIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AddMentorModal } from '@/components/Admin/mentors/AddMentorModal';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';

export default function MentorsPage() {
  const { adminData, refreshAdmin } = useAdminAuthStore();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMentors, setSelectedMentors] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  if (!adminData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Filter mentors based on search query
  const filteredMentors = (adminData.mentors as StrippedDownMentor[]).filter((mentor: StrippedDownMentor) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      mentor.phone.toLowerCase().includes(query) ||
      mentor.name.toLowerCase().includes(query) ||
      mentor.email.toLowerCase().includes(query)
    );
  });

  const handleMentorSelect = (mentor: StrippedDownMentor) => {
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
    }
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

  const handleModalSuccess = async () => {
    try {
      await refreshAdmin();
    } catch (error) {
      console.error('Error refreshing admin data:', error);
    }
  };

  if (!adminData.mentors || adminData.mentors.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Mentors Management</h2>
          <AddMentorModal onSuccess={handleModalSuccess} />
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
        <AddMentorModal onSuccess={handleModalSuccess} />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredMentors.map((mentor: StrippedDownMentor) => (
          <MentorListItem
            key={mentor.phone}
            mentor={mentor}
            onSelect={() => handleMentorSelect(mentor)}
            isSelected={isSelectionMode && selectedMentors.has(mentor.email)}
          />
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No mentors found matching your search</p>
        </div>
      )}
    </div>
  );
} 