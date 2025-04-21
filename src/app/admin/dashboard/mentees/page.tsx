'use client';

import { useState, useEffect } from 'react';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { RegisterMenteeModal } from '@/components/app/admin/mentees/register-mentee-modal';
import MenteesList from '@/components/Admin/mentees/MenteesList';
import { fetchMentees, MenteesFilters, fullMenteesList } from '@/services/admin';
import { toast } from 'react-hot-toast';
import { MenteesForCsvExport } from '@/types/mentee';
import { KeyIcon, MagnifyingGlassIcon, PlusIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import ResetPasswordModal from '@/components/Admin/ResetPasswordModal';
import AssignToCourseModal from '@/components/Admin/mentees/AssignToCourseModal';
import { AssignMentorModal } from '@/components/Admin/mentees/assign-mentor-modal';
import { assignMentorToMentee } from '@/services/admin'

export default function MenteesPage() {
  const { adminData, getCourseGroups, getAuthHeader, setAllMentees, allMentees } = useAdminAuthStore();
  const [mentees, setMentees] = useState<MenteesForCsvExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<MenteesFilters>({
    limit: 10,
    skip: 0
  });
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchingAllMentees, setFetchingAllMentees] = useState(false);
  const [searchResults, setSearchResults] = useState<MenteesForCsvExport[] | null>(null);
  const [showAssignToCourseModal, setShowAssignToCourseModal] = useState(false);
  const [selectedMenteeForCourse, setSelectedMenteeForCourse] = useState<MenteesForCsvExport | null>(null);
  const [showAssignMentorModal, setShowAssignMentorModal] = useState(false);
  const [selectedMenteeForMentor, setSelectedMenteeForMentor] = useState<MenteesForCsvExport | null>(null);
  const [assigningMentor, setAssigningMentor] = useState<string | null>(null);

  useEffect(() => {
    fetchMenteesData();
  }, [filters]); // Add filters as dependency

  const fetchMenteesData = async () => {
    try {
      setLoading(true);
      const response = await fetchMentees(filters, getAuthHeader());
      setMentees(response.mentees);
      // If we get fewer mentees than the limit, there are no more to fetch
      setHasMore(response.mentees.length === filters.limit);
    } catch (error) {
      toast.error('Error fetching mentees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAllMentees = async () => {
    try {
      setFetchingAllMentees(true);
      const response = await fullMenteesList(getAuthHeader());
      setAllMentees(response.mentees);
      setSearchEnabled(true);
      toast.success('Successfully fetched all mentees');
    } catch (error) {
      console.error('Error fetching all mentees:', error);
      toast.error('Failed to fetch all mentees');
    } finally {
      setFetchingAllMentees(false);
    }
  };

  const handleSearch = async () => {
    if (!allMentees) {
      try {
        setFetchingAllMentees(true);
        const response = await fullMenteesList(getAuthHeader());
        setAllMentees(response.mentees);
        setSearchEnabled(true);
        toast.success('Successfully fetched all mentees');
        
        // Only proceed with search after mentees are fetched
        if (!searchQuery.trim()) {
          setSearchResults(null);
          return;
        }

        const query = searchQuery.toLowerCase().trim();
        const results = response.mentees.filter(mentee => {
          const name = mentee.name?.toLowerCase() || '';
          const email = mentee.email?.toLowerCase() || '';
          const phone = mentee.phone?.toLowerCase() || '';

          return name.includes(query) ||
                 email.includes(query) ||
                 phone.includes(query);
        });

        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching all mentees:', error);
        toast.error('Failed to fetch all mentees');
      } finally {
        setFetchingAllMentees(false);
      }
    } else {
      // If mentees are already fetched, proceed with search directly
      if (!searchQuery.trim()) {
        setSearchResults(null);
        return;
      }

      const query = searchQuery.toLowerCase().trim();
      const results = allMentees.filter(mentee => {
        const name = mentee.name?.toLowerCase() || '';
        const email = mentee.email?.toLowerCase() || '';
        const phone = mentee.phone?.toLowerCase() || '';

        return name.includes(query) ||
               email.includes(query) ||
               phone.includes(query);
      });

      setSearchResults(results);
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
    // Reset to first page on refresh
    setFilters(prev => ({ ...prev, skip: 0 }));
  };

  const handleFilterChange = (key: keyof MenteesFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      skip: 0 // Reset skip to 0 when filters change
    }));
  };

  const handleNextPage = () => {
    setFilters(prev => ({
      ...prev,
      skip: prev.skip + prev.limit
    }));
  };

  const handlePrevPage = () => {
    setFilters(prev => ({
      ...prev,
      skip: Math.max(0, prev.skip - prev.limit)
    }));
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

      {/* Search all mentees search bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Search All Mentees</h3>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
              <MagnifyingGlassIcon 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={fetchingAllMentees}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                fetchingAllMentees
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
              }`}
            >
              {fetchingAllMentees ? 'Fetching...' : 'Search'}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Search through all mentees by their name, email, or phone number
          </p>
        </div>
      </div>

      {/* Search Results */}
      {searchResults !== null && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results ({searchResults.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No mentees found matching your search.
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned Mentor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {searchResults.map((mentee) => (
                        <tr key={mentee.phone}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {mentee.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {mentee.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {mentee.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {mentee.assignedMentor ? mentee.assignedMentor.name : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedMenteeForMentor(mentee);
                                  setShowAssignMentorModal(true);
                                }}
                                disabled={assigningMentor === mentee.phone}
                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                                  assigningMentor === mentee.phone
                                    ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                                    : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                }`}
                              >
                                <UserPlusIcon className="h-4 w-4 mr-1" />
                                {assigningMentor === mentee.phone ? 'Assigning...' : 'Assign Mentor'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="divide-y divide-gray-200">
                    {searchResults.map((mentee) => (
                      <div key={mentee.phone} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{mentee.name}</h3>
                            <p className="text-sm text-gray-500">{mentee.email}</p>
                            <p className="text-sm text-gray-500">{mentee.phone}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Mentor: {mentee.assignedMentor ? mentee.assignedMentor.name : '-'}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedMenteeForMentor(mentee);
                              setShowAssignMentorModal(true);
                            }}
                            disabled={assigningMentor === mentee.phone}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                              assigningMentor === mentee.phone
                                ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                                : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                            }`}
                          >
                            <UserPlusIcon className="h-4 w-4 mr-1" />
                            {assigningMentor === mentee.phone ? 'Assigning...' : 'Assign Mentor'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <MenteesList 
        courses={adminData.courses || []} 
        groups={groups} 
        mentees={mentees}
        loading={loading}
        onRefresh={handleRefresh}
        filters={filters}
        onFilterChange={handleFilterChange}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        hasMore={hasMore}
        currentPage={Math.floor(filters.skip / filters.limit) + 1}
      />

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