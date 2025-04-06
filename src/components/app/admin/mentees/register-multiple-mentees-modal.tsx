'use client';

import { useState } from 'react';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { UpdateMenteeCourseRequest } from '@/types/admin';
import { updateMenteeEnrolledInGroup, updateMenteesEnrolledInCourse } from '@/services/admin';
import { MentorshipGroup } from '@/types/session';

interface RegisterMenteesToCourseProps {
  courseId: string;
  groups?: MentorshipGroup[];
  onSuccess?: () => void;
}

export function RegisterMenteesToCourse({ courseId, groups = [], onSuccess }: RegisterMenteesToCourseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAuthHeader } = useAdminAuthStore();
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        throw new Error('No auth header found');
      }

      // Filter out empty phone numbers
      const validPhoneNumbers = phoneNumbers.filter(phone => phone.trim() !== '');

      if (validPhoneNumbers.length === 0) {
        throw new Error('Please add at least one phone number');
      }

      const requestBody: UpdateMenteeCourseRequest = {
        menteesToAdd: validPhoneNumbers,
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
        setPhoneNumbers(['']); // Reset to initial state
        setSelectedGroupId(''); // Reset selected group
      } catch(error) {
        throw new Error('Failed to register mentees');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register mentees. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  const addPhoneNumberField = () => {
    setPhoneNumbers([...phoneNumbers, '']);
  };

  const removePhoneNumberField = (index: number) => {
    if (phoneNumbers.length > 1) {
      const newPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
      setPhoneNumbers(newPhoneNumbers);
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

          <div className="space-y-4">
            {phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                  placeholder="Enter phone number"
                  required={index === 0}
                  className="flex-1"
                />
                {phoneNumbers.length > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => removePhoneNumberField(index)}
                    className="px-2"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={addPhoneNumberField}
            className="w-full"
          >
            Add Another Phone Number
          </Button>

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