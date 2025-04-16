import { useState, useEffect, useRef } from 'react';
import { MenteesForCsvExport } from '@/types/mentee';
import { MenteesFilters, assignMentorToMentee } from '@/services/admin';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { MagnifyingGlassIcon, ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { AssignMentorModal } from './assign-mentor-modal';
import SearchFilters from './search-filters';
import MenteeRow from './MenteeRow';
import MenteeMobileCard from './MenteeMobileCard';

interface MenteesListProps {
  courses: { id: string; name: string }[];
  groups: { groupId: string; groupFriendlyName: string; course: string }[];
  mentees: MenteesForCsvExport[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  filters: MenteesFilters;
  onFilterChange: (key: keyof MenteesFilters, value: string | number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  hasMore: boolean;
  currentPage: number;
}

export default function MenteesList({
  courses,
  groups,
  mentees: initialMentees,
  loading: initialLoading,
  onRefresh,
  filters,
  onFilterChange,
  onNextPage,
  onPrevPage,
  hasMore,
  currentPage
}: MenteesListProps) {
  const [mentees, setMentees] = useState<MenteesForCsvExport[]>(initialMentees);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const authHeader = useAdminAuthStore((state) => state.getAuthHeader)();
  const adminData = useAdminAuthStore((state) => state.adminData);
  const fetchInProgress = useRef(false);
  const [assigningMentor, setAssigningMentor] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState<MenteesForCsvExport | null>(null);

  useEffect(() => {
    setMentees(initialMentees);
  }, [initialMentees]);

  useEffect(() => {
    setLoading(initialLoading);
  }, [initialLoading]);

  const handleRefresh = async () => {
    console.log('request to Refresh mentees list');
    if (!fetchInProgress.current) {
      console.log('Refreshing mentees list...');
      await onRefresh();
    }
  };

  const handleAssignMentor = (mentee: MenteesForCsvExport) => {
    setSelectedMentee(mentee);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async (mentorPhone: string) => {
    if (!authHeader || !selectedMentee || !mentorPhone) return;

    setAssigningMentor(selectedMentee.phone);
    try {
      await assignMentorToMentee(selectedMentee.phone, { mentorUserName: mentorPhone, mentee: { n: selectedMentee.name, p: selectedMentee.phone, e: selectedMentee.email } }, authHeader);

      toast.success(`Mentor assigned successfully to ${selectedMentee.name}`);
      setShowAssignModal(false);
      setSelectedMentee(null);
      await onRefresh();
    } catch (error) {
      console.error('Failed to assign mentor:', error);
      toast.error(`Failed to assign mentor to ${selectedMentee.name}`);
    } finally {
      setAssigningMentor(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mentees</h2>
      </div>
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
        <SearchFilters
          courses={courses}
          groups={groups}
          filters={filters}
          onFilterChange={onFilterChange}
        />
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Mentor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mentees.map((mentee) => (
                    <MenteeRow
                      key={mentee.phone}
                      mentee={mentee}
                      assigningMentor={assigningMentor}
                      onAssignMentor={handleAssignMentor}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {mentees.map((mentee) => (
                <MenteeMobileCard
                  key={mentee.phone}
                  mentee={mentee}
                  assigningMentor={assigningMentor}
                  onAssignMentor={handleAssignMentor}
                />
              ))}
            </div>

            {/* Add pagination controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={onPrevPage}
                  disabled={currentPage === 1 || loading}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 || loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={onNextPage}
                  disabled={!hasMore || loading}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    !hasMore || loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={onPrevPage}
                      disabled={currentPage === 1 || loading}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 || loading
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={onNextPage}
                      disabled={!hasMore || loading}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        !hasMore || loading
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Assign Mentor Modal */}
      <AssignMentorModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedMentee(null);
        }}
        onSubmit={handleAssignSubmit}
        mentors={adminData?.mentors || []}
        loading={!!assigningMentor}
      />
    </div>
  );
} 