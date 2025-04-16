'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { RegisterMenteeModal } from '@/components/app/admin/mentees/register-mentee-modal';
import MenteesList from '@/components/Admin/mentees/MenteesList';
import { fetchMentees, MenteesFilters, fullMenteesList } from '@/services/admin';
import { toast } from 'react-hot-toast';
import { MenteesForCsvExport } from '@/types/mentee';
import { KeyIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ResetPasswordModal from '@/components/Admin/ResetPasswordModal';

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

  const handleSearch = () => {
    if (!allMentees || !searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = allMentees.filter(mentee => {
      // Safely handle null/undefined values
      const name = mentee.name?.toLowerCase() || '';
      const email = mentee.email?.toLowerCase() || '';
      const phone = mentee.phone?.toLowerCase() || '';

      return name.includes(query) ||
             email.includes(query) ||
             phone.includes(query);
    });

    setSearchResults(results);
  };

  if (!adminData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Extract courses from adminData
  const courses = adminData.courses?.map(course => ({
    id: course.id,
    name: course.name
  })) || [];

  // Get all groups from all courses
  const groups = courses.flatMap(course => {
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
          
          {/* TODO uncomment it after backend implementation 
          <button
            onClick={() => setShowResetPasswordModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <KeyIcon className="h-5 w-5 mr-2" />
            Reset Password
          </button> */}
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
                  if (e.key === 'Enter' && searchEnabled) {
                    handleSearch();
                  }
                }}
                disabled={!searchEnabled}
                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                  searchEnabled 
                    ? 'border-gray-300 focus:ring-orange-500 focus:border-orange-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              />
              <MagnifyingGlassIcon 
                className={`absolute left-3 top-2.5 h-5 w-5 ${
                  searchEnabled ? 'text-gray-400' : 'text-gray-300'
                }`}
              />
            </div>
            {searchEnabled ? (
              <button
                onClick={handleSearch}
                className="px-4 py-2 rounded-md text-sm font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Search
              </button>
            ) : (
              <button
                onClick={handleFetchAllMentees}
                disabled={fetchingAllMentees}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  fetchingAllMentees
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                }`}
              >
                {fetchingAllMentees ? 'Fetching...' : 'Fetch All Mentees'}
              </button>
            )}
          </div>
          {searchEnabled && (
            <p className="text-xs text-gray-500">
              Search through all mentees by their name, email, or phone number
            </p>
          )}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <MenteesList 
        courses={courses} 
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
    </div>
  );
} 