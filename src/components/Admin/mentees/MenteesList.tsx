import { useState, useEffect, useRef } from 'react';
import { MenteesForCsvExport, StrippedDownMentee, PreferredSlot } from '@/types/mentee';
import { fetchMentees, MenteesFilters, assignMentorToMentee } from '@/services/admin';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { MagnifyingGlassIcon, ArrowPathIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { sendOnBoardingEmail } from '@/services/mentors';
import { toast } from 'react-hot-toast';
import { AssignMentorModal } from './assign-mentor-modal';

interface MenteesListProps {
  courses: { id: string; name: string }[];
  groups: { groupId: string; groupFriendlyName: string; course: string }[];
  mentees: MenteesForCsvExport[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

export default function MenteesList({ courses, groups, mentees: initialMentees, loading: initialLoading, onRefresh }: MenteesListProps) {
  const [mentees, setMentees] = useState<MenteesForCsvExport[]>(initialMentees);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MenteesFilters>({
    limit: 10,
    skip: 0
  });
  const authHeader = useAdminAuthStore((state) => state.getAuthHeader)();
  const adminData = useAdminAuthStore((state) => state.adminData);
  const fetchInProgress = useRef(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
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

  const handleFilterChange = (key: keyof MenteesFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      skip: 0 // Reset skip to 0 when filters change
    }));
  };

  const handleSendOnboardingEmail = async (mentee: MenteesForCsvExport) => {
    if (!authHeader || sendingEmail) return;

    setSendingEmail(mentee.phone);
    setEmailError(null);

    try {
      // Create a StrippedDownMentee object with required fields
      const strippedMentee: StrippedDownMentee = {
        name: mentee.name,
        phone: mentee.phone,
        email: mentee.email,
        preferredSlot: PreferredSlot.ALL // Default
      };

      await sendOnBoardingEmail(strippedMentee, authHeader);
      // Show success message (you might want to add a toast notification here)
    } catch (error) {
      console.error('Failed to send onboarding email:', error);
      setEmailError(`Failed to send email to ${mentee.name}`);
    } finally {
      setSendingEmail(null);
    }
  };

  const handleAssignMentor = async (mentee: MenteesForCsvExport) => {
    setSelectedMentee(mentee);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async (mentorPhone: string) => {
    if (!authHeader || !selectedMentee || !mentorPhone) return;

    setAssigningMentor(selectedMentee.phone);
    try {
      await assignMentorToMentee(selectedMentee.phone, { mentorUserName: mentorPhone, mentee: { name: selectedMentee.name, phone: selectedMentee.phone, email: selectedMentee.email } }, authHeader);

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
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full sm:w-auto ${loading
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
            {emailError && (
              <div className="p-2 text-center text-red-500 bg-red-50">
                <p>{emailError}</p>
              </div>
            )}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                        <button
                          onClick={() => handleSendOnboardingEmail(mentee)}
                          disabled={sendingEmail === mentee.phone}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${sendingEmail === mentee.phone
                              ? 'bg-orange-100 text-orange-400 cursor-not-allowed'
                              : 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                            }`}
                        >
                          {sendingEmail === mentee.phone ? 'Sending...' : 'Send Onboarding Email'}
                        </button>
                        {!mentee.assignedMentor && (
                          <button
                            onClick={() => handleAssignMentor(mentee)}
                            disabled={assigningMentor === mentee.phone}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${assigningMentor === mentee.phone
                                ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                                : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                              }`}
                          >
                            <UserPlusIcon className="h-4 w-4 mr-1" />
                            {assigningMentor === mentee.phone ? 'Assigning...' : 'Assign Mentor'}
                          </button>
                        )}
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
                    <div className="text-sm text-gray-500">
                      <p>Assigned Mentor: {mentee.assignedMentor ? mentee.assignedMentor.name : '-'}</p>
                    </div>
                    <div className="pt-2 space-y-2">
                      <button
                        onClick={() => handleSendOnboardingEmail(mentee)}
                        disabled={sendingEmail === mentee.phone}
                        className={`w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${sendingEmail === mentee.phone
                            ? 'bg-orange-100 text-orange-400 cursor-not-allowed'
                            : 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                          }`}
                      >
                        {sendingEmail === mentee.phone ? 'Sending...' : 'Send Onboarding Email'}
                      </button>
                      {!mentee.assignedMentor && (
                        <button
                          onClick={() => handleAssignMentor(mentee)}
                          disabled={assigningMentor === mentee.phone}
                          className={`w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${assigningMentor === mentee.phone
                              ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                              : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                            }`}
                        >
                          <UserPlusIcon className="h-4 w-4 mr-1" />
                          {assigningMentor === mentee.phone ? 'Assigning...' : 'Assign Mentor'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

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