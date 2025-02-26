'use client';

import { Mentee } from '@/types/mentee';

interface ProfileProps {
  mentee: Mentee;
}

export default function Profile({ mentee }: ProfileProps) {
  // Add type guard to handle potentially null values
  const interests = mentee?.interests || [];
  const skills = mentee?.skills || [];
  
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.email || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Region</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.region || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Gender</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.gender || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Academic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Category</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.category || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Optional Subject</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.optionalSubject || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Working Professional</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.isWorkingProfessional ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Given Interview</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.givenInterview ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">UPSC Attempts</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.numberOfAttemptsInUpsc || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Mains Attempts</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.numberOfMainsAttempts || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Study Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Preferred Slots</p>
            <p className="mt-1 text-sm text-gray-900">
              {mentee.preferredSlots?.map(slot => slot.toString()).join(', ') || 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Answer Writing Level</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.answerWritingLevel || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Strong Subjects</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.strongSubjects?.join(', ') || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Weak Subjects</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.weakSubjects?.join(', ') || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Previously Enrolled Courses</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.previouslyEnrolledCourses?.join(', ') || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Primary Source of Current Affairs</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.primarySourceOfCurrentAffairs || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Expectations from Mentorship</p>
            <p className="mt-1 text-sm text-gray-900">{mentee.expectationFromMentorshipCourse || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {interests.length > 0 ? (
            interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {interest}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No interests added yet</p>
          )}
        </div>
      </div>

      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No skills added yet</p>
          )}
        </div>
      </div>
    </div>
  );
} 