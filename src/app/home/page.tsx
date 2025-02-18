'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenteeStore } from '@/stores/mentee/store';
import Sidebar from '@/components/Home/Sidebar';
import SessionDetails from '@/components/Home/SessionDetails';
import AskMentor from '@/components/Home/AskMentor';
import { Mentee } from '@/types/mentee';

export default function HomePage() {
  const router = useRouter();
  const mentee = useMenteeStore((state: { mentee: Mentee | null }) => state.mentee);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    if (!mentee) {
      router.push('/login');
    }
  }, [mentee, router]);

  const renderProfile = () => {
    if (!mentee) return null;

    return (
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="border-b pb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Region</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.region}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.gender}</p>
            </div>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Category</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Optional Subject</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.optionalSubject}</p>
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
              <p className="mt-1 text-sm text-gray-900">{mentee.numberOfAttemptsInUpsc}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mains Attempts</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.numberOfMainsAttempts}</p>
            </div>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Study Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Preferred Slots</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.preferredSlots.join(', ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Answer Writing Level</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.answerWritingLevel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Strong Subjects</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.strongSubjects.join(', ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Weak Subjects</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.weakSubjects.join(', ')}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Previously Enrolled Courses</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.previouslyEnrolledCourses.join(', ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Primary Source of Current Affairs</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.primarySourceOfCurrentAffairs}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Expectations from Mentorship</p>
              <p className="mt-1 text-sm text-gray-900">{mentee.expectationFromMentorshipCourse}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfile();
      case 'session-details':
        return <SessionDetails />;
      case 'ask-mentor':
        return <AskMentor />;
      default:
        return renderProfile();
    }
  };

  if (!mentee) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {mentee.name}!</h1>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
} 