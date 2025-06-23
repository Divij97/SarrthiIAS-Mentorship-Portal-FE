'use client';

import { StrippedDownMentor } from '@/types/mentor';
import EditMentorModal from '../Home/EditMentorModal';
import { useState } from 'react';
import { updateMentor } from '@/services/mentors';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import toast from 'react-hot-toast';

interface MentorListItemProps {
  mentor: StrippedDownMentor;
}

export default function MentorListItem({ mentor }: MentorListItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const handleUpdate = async (data: { displayName: string; displayEmail: string }) => {
    try {
      setError(null);
      const authHeader = useAdminAuthStore.getState().getAuthHeader();
      await updateMentor({ ...data, phone: mentor.phone }, authHeader);
      // Update local admin store
      useAdminAuthStore.setState((state) => {
        if (!state.adminData) return {};
        return {
          adminData: {
            ...state.adminData,
            mentors: state.adminData.mentors.map((m) =>
              m.phone === mentor.phone
                ? { ...m, displayName: data.displayName, displayEmail: data.displayEmail }
                : m
            ),
          },
        };
      });
      setIsModalOpen(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {mentor.displayName || mentor.name}
        </h3>
        <p className="text-sm text-gray-500">{mentor.displayEmail || mentor.email}</p>
      </div>
      
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-500">Phone</p>
        <p className="text-sm text-gray-900">{mentor.phone}</p>
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-500">Assigned Mentees</p>
        <p className="text-sm text-gray-900">{mentor.countOfAssignedMentees}</p>
      </div>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
        Edit Profile
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <EditMentorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mentor={mentor}
        onUpdate={handleUpdate}
      />
    </div>
  );
} 