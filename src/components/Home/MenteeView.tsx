import { Mentee } from '@/types/mentee';

interface MenteeViewProps {
  mentee: Mentee;
}

export default function MenteeView({ mentee }: MenteeViewProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome, {mentee.name}!</h1>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm sm:text-base text-gray-900 break-words">{mentee.email}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Phone</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.phone}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Region</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.region}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Gender</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.gender}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Category</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.category}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Preparation Background</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Optional Subject</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.optionalSubject ? mentee.optionalSubject.split('_').join(' ') : 'Not specified'}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Working Professional</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.isWorkingProfessional ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Given Interview</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.givenInterview ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">UPSC Attempts</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.numberOfAttemptsInUpsc}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Mains Attempts</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.numberOfMainsAttempts}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Study Preferences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Preferred Time Slots</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                  {mentee.preferredSlots?.map((slot) => (
                    <span key={slot} className="px-2 py-0.5 sm:py-1 bg-orange-100 text-orange-800 rounded text-xs sm:text-sm">
                      {slot}
                    </span>
                  )) || <span className="text-gray-500 text-sm">None specified</span>}
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Answer Writing Level</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.answerWritingLevel || 'Just started Preparation'}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Weak Subjects</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                  {mentee.weakSubjects?.map((subject) => (
                    <span key={subject} className="px-2 py-0.5 sm:py-1 bg-red-100 text-red-800 rounded text-xs sm:text-sm">
                      {subject}
                    </span>
                  )) || <span className="text-gray-500 text-sm">None specified</span>}
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Strong Subjects</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                  {mentee.strongSubjects?.map((subject) => (
                    <span key={subject} className="px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded text-xs sm:text-sm">
                      {subject}
                    </span>
                  )) || <span className="text-gray-500 text-sm">None specified</span>}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Additional Information</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Previously Enrolled Courses</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                  {mentee.previouslyEnrolledCourses?.map((course) => (
                    <span key={course} className="px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded text-xs sm:text-sm">
                      {course}
                    </span>
                  )) || <span className="text-gray-500 text-sm">None specified</span>}
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Primary Source of Current Affairs</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.primarySourceOfCurrentAffairs || 'Not specified'}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Expectation from Mentorship</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.expectationFromMentorshipCourse || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 