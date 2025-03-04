import { useMentorStore } from '@/stores/mentor/store';
import { Mentor } from '@/types/mentor';

interface MentorViewProps {
  mentor: Mentor;
}

export default function MentorView({ mentor }: MentorViewProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Welcome, {mentor.name}!</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{mentor.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900">{mentor.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Region</p>
                <p className="text-gray-900">{mentor.region}</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mentorship Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Optional Subject</p>
                <p className="text-gray-900">{mentor.optionalSubject.split('_').join(' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">UPSC Interview Experience</p>
                <p className="text-gray-900">{mentor.givenInterview ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">UPSC Attempts</p>
                <p className="text-gray-900">{mentor.numberOfAttemptsInUpsc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 