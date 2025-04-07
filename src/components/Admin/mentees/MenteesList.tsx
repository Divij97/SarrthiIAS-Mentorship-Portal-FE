import { useState, useEffect, useRef, useCallback } from 'react';
import { MenteesForCsvExport, StrippedDownMentee } from '@/types/mentee';
import { fetchMentees, MenteesFilters } from '@/services/admin';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface MenteesListProps {
  courses: { id: string; name: string }[];
  groups: { groupId: string; groupFriendlyName: string; course: string }[];
}

export default function MenteesList({ courses, groups }: MenteesListProps) {
  const [mentees, setMentees] = useState<MenteesForCsvExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MenteesFilters>({
    limit: 10,
    skip: 0
  });
  const authHeader = useAdminAuthStore((state) => state.getAuthHeader)();
  const fetchInProgress = useRef(false);
  
  // Using useCallback to memoize the fetch function
  const fetchMenteesList = useCallback(async () => {
    // Prevent concurrent fetches
    if (fetchInProgress.current || !authHeader) {
      if (!authHeader) {
        setError('Authentication required');
      }
      return;
    }
    
    // Log to verify single fetch
    console.log('Fetching mentees data...', new Date().toISOString());
    
    try {
      fetchInProgress.current = true;
      setLoading(true);
      setError(null);
      const response = await fetchMentees(filters, authHeader);
      setMentees(response.mentees);
    } catch (err) {
      console.error('Error fetching mentees:', err);
      setError('Failed to load mentees. Please try again.');
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [filters, authHeader]);

  useEffect(() => {
    fetchMenteesList();
    
    // Cleanup function to prevent state updates if component unmounts during fetch
    return () => {
      fetchInProgress.current = true; // Prevents any ongoing fetches from completing
    };
  }, [fetchMenteesList]); // Dependency is the memoized fetch function

  const handleFilterChange = (key: keyof MenteesFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleRefresh = () => {
    if (!fetchInProgress.current) {
      fetchMenteesList();
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full sm:w-auto ${
              loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="courseFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Course
            </label>
            <select
              id="courseFilter"
              value={filters.courseId || ''}
              onChange={(e) => handleFilterChange('courseId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="groupFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Group
            </label>
            <select
              id="groupFilter"
              value={filters.groupId || ''}
              onChange={(e) => handleFilterChange('groupId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={!filters.courseId}
            >
              <option value="">All Groups</option>
              {groups
                .filter(group => !filters.courseId || group.course === filters.courseId)
                .map(group => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.groupFriendlyName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="limitFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Results per page
            </label>
            <select
              id="limitFilter"
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mentees List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            <MagnifyingGlassIcon className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2">Loading mentees...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : mentees.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No mentees found matching the selected filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mentees.map((mentee) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {mentees.map((mentee) => (
                <div key={mentee.phone} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{mentee.name}</h4>
                      <span className="text-xs text-gray-500">{mentee.phone}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>{mentee.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 