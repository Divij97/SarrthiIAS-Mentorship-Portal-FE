import { useMentorStore } from '@/stores/mentor/store';
import { Mentor } from '@/types/mentor';

interface MentorViewProps {
  mentor: Mentor;
}

export default function MentorView({ mentor }: MentorViewProps) {
  if (!mentor) {
    return <div className="min-h-screen flex items-center justify-center">Loading mentor data...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome, {mentor.name}!</h1>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm sm:text-base text-gray-900 break-words">{mentor.email}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Phone</p>
                <p className="text-sm sm:text-base text-gray-900">{mentor.phone}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Region</p>
                <p className="text-sm sm:text-base text-gray-900">{mentor.region}</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Mentorship Details</h2>
            <div className="space-y-3">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Optional Subject</p>
                <p className="text-sm sm:text-base text-gray-900">
                  {mentor.optionalSubject ? mentor.optionalSubject.split('_').join(' ') : 'Not specified'}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">UPSC Interview Experience</p>
                <p className="text-sm sm:text-base text-gray-900">
                  {mentor.givenInterview !== undefined ? (mentor.givenInterview ? 'Yes' : 'No') : 'Not specified'}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">UPSC Attempts</p>
                <p className="text-sm sm:text-base text-gray-900">
                  {mentor.numberOfAttemptsInUpsc !== undefined ? mentor.numberOfAttemptsInUpsc : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 