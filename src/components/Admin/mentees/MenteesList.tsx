import { useState, useMemo } from 'react';
import { MenteesForCsvExport } from '@/types/mentee';
import { MenteesFilters, assignMentorToMentee, fullMenteesList } from '@/services/admin';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { AssignMentorModal } from './assign-mentor-modal';
import SearchFilters from './search-filters';
import MenteeRow from './MenteeRow';
import MenteeMobileCard from './MenteeMobileCard';

interface MenteesListProps {
  allMentees: MenteesForCsvExport[];
  courses: { id: string; name: string }[];
  groups: { groupId: string; groupFriendlyName: string; course: string }[];
  onRefresh: () => Promise<void>;
}

export default function MenteesList({
  allMentees,
  courses,
  groups,
  onRefresh
}: MenteesListProps) {
  const [mentees, setMentees] = useState<MenteesForCsvExport[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MenteesFilters>({ limit: 10, skip: 0 });
  const [fullMentees, setFullMentees] = useState<MenteesForCsvExport[]>([]);
  const authHeader = useAdminAuthStore((state) => state.getAuthHeader)();
  const adminData = useAdminAuthStore((state) => state.adminData);
  const [assigningMentor, setAssigningMentor] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState<MenteesForCsvExport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const applyFiltersAndPagination = (menteesList: MenteesForCsvExport[], currentFilters: MenteesFilters) => {
    let filteredMentees = [...menteesList];

    if (currentFilters.courseId) {
      filteredMentees = filteredMentees.filter(mentee => 
        mentee.assignedCourses?.some(courseId => courseId === currentFilters.courseId)
      );
    }

    if (currentFilters.groupId) {
      filteredMentees = filteredMentees.filter(mentee => 
        mentee.assignedGroupName === currentFilters.groupId
      );
    }

    if (currentFilters.searchQuery && currentFilters.searchQuery.trim()) {
      const query = currentFilters.searchQuery.toLowerCase().trim();
      filteredMentees = filteredMentees.filter(mentee => {
        const name = mentee.name?.toLowerCase() || '';
        const email = mentee.email?.toLowerCase() || '';
        const phone = mentee.phone || '';
        return name.includes(query) || email.includes(query) || phone.includes(query);
      });
    }

    if (currentFilters.limit === 99999) {
      setPage(1);
      setMentees(filteredMentees);
    } else {
      const startIndex = (page - 1) * currentFilters.limit;
      const paginatedMentees = filteredMentees.slice(startIndex, startIndex + currentFilters.limit);
    
      setMentees(paginatedMentees);
    }   
  };
    
  useMemo(() => {
    if (!allMentees) {
      setMentees([]);
      return;
    }
    setFullMentees(allMentees); 
    applyFiltersAndPagination(allMentees, filters);
  }, [allMentees]);

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

  const handleFilterChange = (key: keyof MenteesFilters, value: string | number) => {
    if (!fullMentees) {
      return;
    }

    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };

    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    applyFiltersAndPagination(fullMentees, newFilters);
  };

  const handleLocalPrevPage = () => {
    if (page === 1) return;
    
    if (!fullMentees) {
      return;
    }

    setPage(prev => prev - 1);
    const prevPageEnd = (page - 1) * filters.limit;
    const prevPageMentees = fullMentees.slice(prevPageEnd - filters.limit, prevPageEnd);
    setMentees(prevPageMentees);
  };

  const handleLocalNextPage = () => {
    if (!fullMentees) {
      return;
    }

    const nextPageStart = page * filters.limit;
    const nextPageMentees = fullMentees.slice(nextPageStart, nextPageStart + filters.limit);
    
    if (nextPageMentees.length === 0) {
      return;
    }

    setPage(prev => prev + 1);
    setMentees(nextPageMentees);
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
            onClick={onRefresh}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full sm:w-auto ${
               'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2`} />
            Refresh
          </button>
        </div>
        <SearchFilters
          courses={courses}
          groups={groups}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <div className="relative flex-1 mt-2">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilterChange('searchQuery', e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFilterChange('searchQuery', searchQuery);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
              <MagnifyingGlassIcon 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              />
            </div>
      </div>

      {/* Mentees List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {mentees.length === 0 ? (
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
                  onClick={handleLocalPrevPage}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleLocalNextPage}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    
                    'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={handleLocalPrevPage}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        page === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={handleLocalNextPage}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        'text-gray-500 hover:bg-gray-50'
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