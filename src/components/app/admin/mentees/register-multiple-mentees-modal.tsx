'use client';

import { useState } from 'react';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { UpdateMenteeCourseRequest } from '@/types/admin';
import { fetchCourseAllMentees, updateMenteeEnrolledInGroup, updateMenteesEnrolledInCourse } from '@/services/admin';
import { MentorshipGroup } from '@/types/session';
import { menteesToCSV, downloadCSV } from '@/utils/csv-utils';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ErrorResponse } from '@/types/error';

interface RegisterMenteesToCourseProps {
  courseId: string;
  groups?: MentorshipGroup[];
  onSuccess?: () => void;
}

export function RegisterMenteesToCourse({ courseId, groups = [], onSuccess }: RegisterMenteesToCourseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { getAuthHeader } = useAdminAuthStore();
  const [phoneNumbersText, setPhoneNumbersText] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        throw new Error('No auth header found');
      }

      // Split the text by newline and filter out empty lines
      const phoneNumbers = phoneNumbersText
        .split('\n')
        .map(number => number.trim())
        .filter(number => number !== '');

      if (phoneNumbers.length === 0) {
        throw new Error('Please add at least one phone number');
      }

      const requestBody: UpdateMenteeCourseRequest = {
        menteesToAdd: phoneNumbers,
        menteesToRemove: [],
      };

      try {
        if (selectedGroupId != '') {
          await updateMenteeEnrolledInGroup(courseId, selectedGroupId, requestBody, authHeader)
        } else {
          await updateMenteesEnrolledInCourse(courseId, requestBody, authHeader);
        }

        toast.success('Mentees registered successfully');
        setIsOpen(false);
        onSuccess?.();
        setPhoneNumbersText(''); // Reset to initial state
        setSelectedGroupId(''); // Reset selected group
      } catch(error) {
        throw new Error(`Failed to register mentees, errorCode: ${(error as ErrorResponse)?.errorCode || 'UNKNOWN'}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register mentees. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        throw new Error('No auth header found');
      }

      // Fetch all mentees for this course
      const mentees = await fetchCourseAllMentees(courseId, authHeader);
      
      if (mentees.length === 0) {
        toast.error('No mentees found for this course');
        return;
      }

      // Generate CSV and download it
      const csv = menteesToCSV(mentees);
      downloadCSV(csv, `course-${courseId}-mentees.csv`);
      
      toast.success('Mentees list downloaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download mentees list. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Manage Mentees</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Manage Course Mentees"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Download Button */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDownloadCSV}
              disabled={isDownloading}
              className="flex items-center space-x-1"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>{isDownloading ? 'Downloading...' : 'Download All Mentees (CSV)'}</span>
            </Button>
          </div>

          {/* Group Selection Dropdown */}
          {groups.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="group-select" className="block text-sm font-medium text-gray-700">
                Assign to Group (Optional)
              </label>
              <select
                id="group-select"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              >
                <option value="">Don't assign</option>
                {groups.map((group) => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.groupFriendlyName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                If selected, mentees will be assigned to this group
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="phone-numbers" className="block text-sm font-medium text-gray-700">
              Phone Numbers
            </label>
            <textarea
              id="phone-numbers"
              value={phoneNumbersText}
              onChange={(e) => setPhoneNumbersText(e.target.value)}
              placeholder="Enter phone numbers (one per line)"
              required
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm resize-y"
            />
            <p className="text-xs text-gray-500">
              Enter each phone number on a new line
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
} 