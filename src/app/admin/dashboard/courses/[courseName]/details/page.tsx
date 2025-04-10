'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { MentorshipGroup } from '@/types/session';
import { UserGroupIcon, ArrowLeftIcon, XCircleIcon, UserPlusIcon, UsersIcon, DocumentPlusIcon, DocumentTextIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { ArrowTopRightOnSquareIcon as ExternalLinkIcon } from '@heroicons/react/24/outline';
import { fetchCourseGroups, createMentorshipGroup, mergeGroups, fetchCourse } from '@/services/courses';
import GroupForm, { GroupFormData } from '@/components/Admin/GroupForm';
import GroupCard from '@/components/Admin/courses/GroupCard';
import { Course, CreateGroupRequest } from '@/types/course';
import { CreateDocumentRequest } from '@/types/course';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { RegisterMenteesToCourse } from '@/components/app/admin/mentees/register-multiple-mentees-modal';
import MergeGroupModal from '@/components/Admin/courses/MergeGroupModal';
import DocumentModal from '@/components/Admin/courses/DocumentModal';
import { addDocumentsToCourse } from '@/services/admin';
import toast from 'react-hot-toast';

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseName: string }>;
}) {
  const router = useRouter();
  const { courseName } = use(params);
  const courseId = decodeURIComponent(courseName);
  const [groups, setGroups] = useState<MentorshipGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const [createGroupError, setCreateGroupError] = useState<string | null>(null);
  const [assigningGroups, setAssigningGroups] = useState(false);
  const [groupsAssigned, setGroupsAssigned] = useState(false);
  const adminData = useAdminAuthStore.getState().adminData;
  const { setCourseGroups, getCourseGroups, assignGroupsToCourse } = useAdminAuthStore();
  const authHeader = useAdminAuthStore((state) => state.getAuthHeader)();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [addingDocuments, setAddingDocuments] = useState(false);
  const [activeTab, setActiveTab] = useState<'groups' | 'documents'>('groups');
  
  // Find the current course to check its type
  const currentCourse = adminData?.courses?.find(course => course.id === courseId);
  const isOneOnOneCourse = currentCourse?.isOneOnOneMentorshipCourse || false;

  const fetchGroups = async () => {
    // If this is a one-on-one course, we don't need to fetch groups
    if (isOneOnOneCourse) {
      setLoading(false);
      return;
    }
    
    if (!authHeader) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const courseResponse = await fetchCourse(courseId, authHeader);
      setCourse(courseResponse);
      
      console.log('Fetching mentorship groups for:', courseId);
      const response = await fetchCourseGroups(courseId, authHeader);
      const mentorshipGroups: MentorshipGroup[] = response.mentorshipGroups || [];
      
      // Store the groups in the admin store
      setCourseGroups(courseId, mentorshipGroups);
      
      // Update local state
      setGroups(mentorshipGroups);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [courseId, authHeader, setCourseGroups, getCourseGroups, isOneOnOneCourse]);

  const handleBackToCourses = () => {
    router.push('/admin/dashboard/courses/active');
  };

  const handleGroupClick = (groupId: string) => {
    console.log('handleGroupClick called with groupId:', groupId);
    // Navigate to group details page
    router.push(`/admin/dashboard/courses/${encodeURIComponent(courseId)}/groups/${groupId}`);
  };

  const handleCreateGroup = () => {
    setIsCreateModalOpen(true);
  };

  const handleAssignGroups = async () => {
    setAssigningGroups(true);
    try {
      if (!currentCourse) {
        throw new Error('Course information not available');
      }
      
      await assignGroupsToCourse(courseId, currentCourse);
      // console.log("Response from assignGroupsToCourse: ", response);
      // Notify user about successful request
      setError(null); // Clear any previous errors
      setGroupsAssigned(true);
      
      toast.success("Group assignment request has been received. Groups will be created shortly. Kindly check back after a few minutes.");
      
      // Try to fetch groups after a short delay to see if they're available
      setTimeout(async () => {
        await fetchGroups();
      }, 10000);
    } catch (error) {
      console.error('Error assigning groups to course:', error);
      setError('Failed to assign groups. Please try again.');
      toast.error('Failed to assign groups. Please try again.');
    } finally {
      setAssigningGroups(false);
    }
  };

  const handleGroupFormSubmit = async (formData: GroupFormData) => {
    if (!authHeader) {
      setCreateGroupError('Authentication required');
      return;
    }

    try {
      setCreateGroupLoading(true);
      setCreateGroupError(null);

      const createGroupRequest: CreateGroupRequest = {
        groupFriendlyName: formData.groupFriendlyName,
        groupMentorshipSessions: [],
        criterion: formData.criterion
      }
      
      // Call the API to create a new group
      await createMentorshipGroup(courseId, createGroupRequest, authHeader);      
      // Close the modal
      setIsCreateModalOpen(false);
      
      console.log('Group created successfully:', formData.groupFriendlyName);
      
      // Refresh the groups list
      await fetchGroups();
      
      toast.success('Group created successfully!');
    } catch (err) {
      console.error('Error creating group:', err);
      setCreateGroupError('Failed to create group. Please try again.');
    } finally {
      setCreateGroupLoading(false);
    }
  };

  const handleGroupSelect = (groupId: string) => {
    console.log('handleGroupSelect called with groupId:', groupId);
    if (!isSelectionMode) return;
    
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      }
      return [...prev, groupId];
    });
  };

  const handleMergeGroups = async (newGroupName: string) => {
    if (selectedGroups.length < 2) {
      alert('Please select at least two groups to merge');
      return;
    }

    if (!authHeader) {
      setCreateGroupError('Authentication required');
      return;
    }

    setIsMerging(true);
    try {
      // Get the selected groups' data
      const selectedGroupsData = groups.filter(group => selectedGroups.includes(group.groupId));
      
      // Combine all sessions from selected groups
      const allSessions = selectedGroupsData.flatMap(group => group.sessions);
      
      // Call mergeGroups with all selected group IDs
      await mergeGroups(selectedGroups, newGroupName, allSessions, courseName, authHeader);
      
      // Reset selection mode
      setIsSelectionMode(false);
      setSelectedGroups([]);
      setIsMergeModalOpen(false);
      
      // Refresh the groups list
      await fetchGroups();
      
      alert('Groups merged successfully!');
    } catch (error) {
      console.error('Error merging groups:', error);
      alert('Failed to merge groups. Please try again.');
    } finally {
      setIsMerging(false);
    }
  };

  const handleSubmitDocuments = async (documents: CreateDocumentRequest[]) => {
    if (!authHeader) {
      toast.error('Authentication required');
      return;
    }

    setAddingDocuments(true);
    try {
      await addDocumentsToCourse(courseId, { documents }, authHeader);
      
      toast.success('Documents added successfully!');
      setIsDocumentModalOpen(false);
      
      // Refresh course data to show new documents
      await fetchGroups();
    } catch (error) {
      console.error('Error adding documents:', error);
      toast.error('Failed to add documents. Please try again.');
    } finally {
      setAddingDocuments(false);
    }
  };

  const handleOpenDocumentModal = () => {
    setIsDocumentModalOpen(true);
  };

  // Render function to display one-on-one mentorship content
  const renderOneOnOneContent = () => {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">One-on-One Mentorship Course</h3>
        <p className="mt-1 text-sm text-gray-500">
          This is a one-on-one mentorship course. Group management is not available.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Mentors and mentees are matched individually for this course.
        </p>
      </div>
    );
  };

  // Render function to display group mentorship content
  const renderGroupContent = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            {groups.length > 1 && (
              <button
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                  setSelectedGroups([]);
                }}
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                  isSelectionMode 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {isSelectionMode ? 'Cancel Selection' : 'Select Groups'}
              </button>
            )}
            {isSelectionMode && selectedGroups.length >= 2 && (
              <button
                onClick={() => setIsMergeModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Merge Selected Groups
              </button>
            )}
          </div>
          
          {isSelectionMode && (
            <div className="text-sm text-gray-600">
              {selectedGroups.length} groups selected
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.groupId}
              group={group}
              onClick={() => {
                if (isSelectionMode) {
                  handleGroupSelect(group.groupId);
                } else {
                  handleGroupClick(group.groupId);
                }
              }}
              isSelected={isSelectionMode && selectedGroups.includes(group.groupId)}
            />
          ))}
        </div>

        <MergeGroupModal
          isOpen={isMergeModalOpen}
          onClose={() => setIsMergeModalOpen(false)}
          onSubmit={handleMergeGroups}
          selectedGroups={selectedGroups}
          groups={groups}
          isLoading={isMerging}
        />

        {groups.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Groups</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click "Assign Groups" to automatically create mentorship groups for this course.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render function to display documents section
  const renderDocumentsSection = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Course Documents</h2>
          <button
            onClick={handleOpenDocumentModal}
            className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm"
          >
            <DocumentPlusIcon className="h-4 w-4 mr-1.5" />
            Add Document
          </button>
        </div>
        
        {(!course || !course.documents || course.documents.length === 0) ? (
          <div className="text-center py-10">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no documents associated with this course.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {course.documents.map((doc, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start">
                  <DocumentIcon className="h-8 w-8 text-purple-500 flex-shrink-0 mr-3" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                    {doc.description && (
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{doc.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-purple-600 hover:text-purple-800"
                  >
                    View Document
                    <ExternalLinkIcon className="ml-1 h-3 w-3" />
                  </a>
                  
                  {doc.disclaimer && (
                    <span className="text-xs text-gray-400 italic truncate ml-2" title={doc.disclaimer}>
                      {doc.disclaimer.length > 20 ? `${doc.disclaimer.slice(0, 20)}...` : doc.disclaimer}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Course Header with Back Button and Title */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={handleBackToCourses}
            className="flex items-center text-orange-600 hover:text-orange-700 font-medium mb-2"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Courses
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{course?.name}</h1>
          {course?.description && (
            <p className="mt-1 text-sm text-gray-500 max-w-3xl">{course.description}</p>
          )}
          {isOneOnOneCourse && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
              One-on-One Course
            </span>
          )}
        </div>

        {/* Action Buttons for non-one-on-one courses */}
        {!isOneOnOneCourse && (
          <div>
            {/* Only show these buttons when groups tab is active */}
            {activeTab === 'groups' && !loading && !error && (
              <div className="flex items-center space-x-3">
                {/* Assign Groups button (only for empty group courses) */}
                {!groupsAssigned && (
                  <button
                    onClick={handleAssignGroups}
                    className={`flex items-center px-4 py-2 ${assigningGroups || groupsAssigned ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700'} text-white rounded-md transition-colors duration-200`}
                    disabled={assigningGroups || groupsAssigned}
                  >
                    <UserPlusIcon className="h-5 w-5 mr-2" />
                    {assigningGroups ? 'Assigning...' : 'Assign Groups'}
                  </button>
                )}
                
                {/* Create New Group button */}
                <button
                  onClick={handleCreateGroup}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
                  disabled={createGroupLoading}
                >
                  {createGroupLoading ? 'Creating...' : 'Create New Group'}
                </button>
                
                {/* Register Multiple Mentees button */}
                <RegisterMenteesToCourse courseId={courseId} groups={groups} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Show assignment received message if relevant */}
      {!loading && !error && !isOneOnOneCourse && groups.length === 0 && groupsAssigned && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          Assignment request received. Groups will be created shortly. Please refresh after a few minutes.
        </div>
      )}

      {/* Show any creation errors */}
      {createGroupError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {createGroupError}
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Loading course details...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-red-500">{error}</p>
        </div>
      ) : (
        <>
          {/* Tab Navigation for non-one-on-one courses */}
          {!isOneOnOneCourse ? (
            <div>
              {/* Tab buttons */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('groups')}
                    className={`${
                      activeTab === 'groups'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Groups
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`${
                      activeTab === 'documents'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Documents
                  </button>
                </nav>
              </div>

              {/* Tab content */}
              {activeTab === 'groups' ? renderGroupContent() : renderDocumentsSection()}
            </div>
          ) : (
            <>
              {/* For one-on-one courses, show a simpler layout */}
              {renderOneOnOneContent()}
              <div className="mt-8">
                {renderDocumentsSection()}
              </div>
            </>
          )}
        </>
      )}

      {/* Modals */}
      {!isOneOnOneCourse && (
        <GroupForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleGroupFormSubmit}
          courseName={currentCourse?.name || courseId}
        />
      )}

      <DocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onSubmit={handleSubmitDocuments}
        isSubmitting={addingDocuments}
      />
    </div>
  );
} 