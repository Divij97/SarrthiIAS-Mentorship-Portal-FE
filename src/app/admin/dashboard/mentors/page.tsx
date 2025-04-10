'use client';

import { useState } from 'react';
import { StrippedDownMentor } from '@/types/mentor';
import MentorListItem from '@/components/Admin/MentorListItem';
import { TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AddMentorModal } from '@/components/Admin/mentors/AddMentorModal';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { deleteResource } from '@/services/admin';
import { ResourceType } from '@/types/admin';
import { toast } from 'react-hot-toast';

export default function MentorsPage() {
  const { adminData, refreshAdmin, getAuthHeader } = useAdminAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingMentor, setDeletingMentor] = useState<string | null>(null);

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

  const handleDeleteMentor = async (mentor: StrippedDownMentor) => {
    if (!mentor.phone) return;
    
    setDeletingMentor(mentor.phone);
    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        throw new Error('No auth header found');
      }
      
      await deleteResource(ResourceType.MENTORS, mentor.phone, authHeader);
      await refreshAdmin();
      toast.success(`Mentor ${mentor.name} deleted successfully`);
    } catch (error) {
      console.error('Error deleting mentor:', error);
      toast.error('Failed to delete mentor. Please try again.');
    } finally {
      setDeletingMentor(null);
    }
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
        <h2 className="text-2xl font-semibold text-gray-900">Mentors Management</h2>
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
          <div key={mentor.phone} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <MentorListItem mentor={mentor} />
            <button
              onClick={() => handleDeleteMentor(mentor)}
              disabled={deletingMentor === mentor.phone}
              className={`flex items-center px-3 py-1.5 rounded-md transition-colors duration-200 ${
                deletingMentor === mentor.phone
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              {deletingMentor === mentor.phone ? 'Deleting...' : 'Delete'}
            </button>
          </div>
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