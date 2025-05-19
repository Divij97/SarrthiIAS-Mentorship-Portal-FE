'use client';

import { useState, useEffect } from 'react';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { RegisterMenteeModal } from '@/components/app/admin/mentees/register-mentee-modal';
import MenteesList from '@/components/Admin/mentees/MenteesList';
import { fetchMentees, MenteesFilters, fullMenteesList, deleteResource } from '@/services/admin';
import { toast } from 'react-hot-toast';
import { MenteesForCsvExport } from '@/types/mentee';
import { KeyIcon, MagnifyingGlassIcon, PlusIcon, UserPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import ResetPasswordModal from '@/components/Admin/ResetPasswordModal';
import AssignToCourseModal from '@/components/Admin/mentees/AssignToCourseModal';
import { AssignMentorModal } from '@/components/Admin/mentees/assign-mentor-modal';
import { assignMentorToMentee } from '@/services/admin'
import { ResourceType } from '@/types/admin';

export default function MenteesPage() {
  const { adminData, getCourseGroups, getAuthHeader, setAllMentees, allMentees } = useAdminAuthStore();
  const [filters, setFilters] = useState<MenteesFilters>({
    limit: 10,
    skip: 0
  });
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchingAllMentees, setFetchingAllMentees] = useState(false);
  const [searchResults, setSearchResults] = useState<MenteesForCsvExport[] | null>(null);
  const [showAssignToCourseModal, setShowAssignToCourseModal] = useState(false);
  const [showAssignMentorModal, setShowAssignMentorModal] = useState(false);
  const [selectedMenteeForMentor, setSelectedMenteeForMentor] = useState<MenteesForCsvExport | null>(null);
  const [assigningMentor, setAssigningMentor] = useState<string | null>(null);
  const [unassigningMentor, setUnassigningMentor] = useState<string | null>(null);
  const [deletingMentee, setDeletingMentee] = useState<string | null>(null);

  useEffect(() => {
    if (!allMentees) {
      handleFetchAllMentees();
    }
  }, [filters]);

  const handleFetchAllMentees = async () => {
    try {
      setFetchingAllMentees(true);
      const response = await fullMenteesList(getAuthHeader());
      setAllMentees(response.mentees.filter(mentee => !mentee.deleted));
      toast.success('Successfully fetched all mentees');
    } catch (error) {
      console.error('Error fetching all mentees:', error);
      toast.error('Failed to fetch all mentees');
    } finally {
      setFetchingAllMentees(false);
    }
  };

  const handleAssignMentor = async (mentorPhone: string) => {
    if (!getAuthHeader || !selectedMenteeForMentor || !mentorPhone) return;

    setAssigningMentor(selectedMenteeForMentor.phone);
    try {
      await assignMentorToMentee(
        selectedMenteeForMentor.phone,
        {
          mentorUserName: mentorPhone,
          mentee: {
            n: selectedMenteeForMentor.name,
            p: selectedMenteeForMentor.phone,
            e: selectedMenteeForMentor.email
          }
        },
        getAuthHeader()
      );

      // Find the mentor details from adminData
      const assignedMentor = adminData?.mentors.find(mentor => mentor.phone === mentorPhone);
      
      // Update the mentee in allMentees with the new mentor details
      if (allMentees) {
        const updatedMentees = allMentees.map(mentee => 
          mentee.phone === selectedMenteeForMentor.phone
            ? { ...mentee, assignedMentor }
            : mentee
        );
        setAllMentees(updatedMentees);
        
        // Update search results if they exist
        if (searchResults !== null) {
          const query = searchQuery.toLowerCase().trim();
          const updatedResults = updatedMentees.filter(mentee => {
            const name = mentee.name?.toLowerCase() || '';
            const email = mentee.email?.toLowerCase() || '';
            const phone = mentee.phone?.toLowerCase() || '';

            return name.includes(query) ||
                   email.includes(query) ||
                   phone.includes(query);
          });
          setSearchResults(updatedResults);
        }
      }

      toast.success(`Mentor assigned successfully to ${selectedMenteeForMentor.name}`);
      setShowAssignMentorModal(false);
      setSelectedMenteeForMentor(null);
      
      // Refresh the main mentees list
      await handleRefresh();
    } catch (error) {
      console.error('Failed to assign mentor:', error);
      toast.error(`Failed to assign mentor to ${selectedMenteeForMentor.name}`);
    } finally {
      setAssigningMentor(null);
    }
  };

  const handleUnassignMentor = async (menteePhone: string) => {
    if (!getAuthHeader || !menteePhone) return;

    setUnassigningMentor(menteePhone);
    try {
      await assignMentorToMentee(
        menteePhone,
        {
          mentorUserName: "UNASSIGNED",
          mentee: {
            n: allMentees?.find(m => m.phone === menteePhone)?.name || '',
            p: menteePhone,
            e: allMentees?.find(m => m.phone === menteePhone)?.email || ''
          }
        },
        getAuthHeader()
      );

      // Update the mentee in allMentees to remove the mentor
      if (allMentees) {
        const updatedMentees = allMentees.map(mentee => 
          mentee.phone === menteePhone
            ? { ...mentee, assignedMentor: null }
            : mentee
        );
        setAllMentees(updatedMentees);
        
        // Update search results if they exist
        if (searchResults !== null) {
          const query = searchQuery.toLowerCase().trim();
          const updatedResults = updatedMentees.filter(mentee => {
            const name = mentee.name?.toLowerCase() || '';
            const email = mentee.email?.toLowerCase() || '';
            const phone = mentee.phone?.toLowerCase() || '';

            return name.includes(query) ||
                   email.includes(query) ||
                   phone.includes(query);
          });
          setSearchResults(updatedResults);
        }
      }

      toast.success('Mentor unassigned successfully');
      
      // Refresh the main mentees list
      await handleRefresh();
    } catch (error) {
      console.error('Failed to unassign mentor:', error);
      toast.error('Failed to unassign mentor');
    } finally {
      setUnassigningMentor(null);
    }
  };

  const handleDeleteMentee = async (menteePhone: string) => {
    if (!getAuthHeader || !menteePhone) return;

    if (!window.confirm('Are you sure you want to delete this mentee? This action cannot be undone.')) {
      return;
    }

    setDeletingMentee(menteePhone);
    try {
      await deleteResource(ResourceType.MENTEES, menteePhone, getAuthHeader());

      // Update the mentees list by removing the deleted mentee
      if (allMentees) {
        const updatedMentees = allMentees.filter(mentee => mentee.phone !== menteePhone);
        setAllMentees(updatedMentees);
        
        // Update search results if they exist
        if (searchResults !== null) {
          const query = searchQuery.toLowerCase().trim();
          const updatedResults = updatedMentees.filter(mentee => {
            const name = mentee.name?.toLowerCase() || '';
            const email = mentee.email?.toLowerCase() || '';
            const phone = mentee.phone?.toLowerCase() || '';

            return name.includes(query) ||
                   email.includes(query) ||
                   phone.includes(query);
          });
          setSearchResults(updatedResults);
        }
      }

      toast.success('Mentee deleted successfully');
    } catch (error) {
      console.error('Failed to delete mentee:', error);
      toast.error('Failed to delete mentee');
    } finally {
      setDeletingMentee(null);
    }
  };

  if (!adminData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Get all groups from all courses
  const groups = (adminData.courses || []).flatMap(course => {
    const courseGroups = getCourseGroups(course.id) || [];
    return courseGroups.map(group => ({
      groupId: group.groupId,
      groupFriendlyName: group.groupFriendlyName,
      course: course.id
    }));
  });

  const handleRefresh = async () => {
    await handleFetchAllMentees();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Mentees Management</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowResetPasswordModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <KeyIcon className="h-5 w-5 mr-2" />
            Reset User Password
          </button>
          <RegisterMenteeModal onSuccess={handleRefresh}/>
        </div>
      </div>

      {allMentees && <MenteesList
        allMentees={allMentees}
        courses={adminData.courses || []} 
        groups={groups} 
        onRefresh={handleRefresh}
        onUnassignMentor={handleUnassignMentor}
        unassigningMentor={unassigningMentor}
        onDeleteMentee={handleDeleteMentee}
        deletingMentee={deletingMentee}
      />}

      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        authHeader={getAuthHeader()}
      />

      <AssignMentorModal
        isOpen={showAssignMentorModal}
        onClose={() => {
          setShowAssignMentorModal(false);
          setSelectedMenteeForMentor(null);
        }}
        onSubmit={handleAssignMentor}
        mentors={adminData?.mentors || []}
        loading={!!assigningMentor}
      />

      {/* <AssignToCourseModal
        isOpen={showAssignToCourseModal}
        onClose={() => {
          setShowAssignToCourseModal(false);
          setSelectedMenteeForCourse(null);
        }}
        mentee={selectedMenteeForCourse!}
        courses={adminData.courses || []}
        authHeader={getAuthHeader()}
        onSuccess={handleRefresh}
      /> */}
    </div>
  );
} 