import { Mentee } from '@/types/mentee';

interface MenteeViewProps {
  mentee: Mentee;
}

export default function MenteeView({ mentee }: MenteeViewProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Welcome, {mentee.name}!</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{mentee.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900">{mentee.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Region</p>
                <p className="text-gray-900">{mentee.region}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="text-gray-900">{mentee.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-gray-900">{mentee.category}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preparation Background</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Optional Subject</p>
                <p className="text-gray-900">{mentee.optionalSubject.split('_').join(' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Working Professional</p>
                <p className="text-gray-900">{mentee.isWorkingProfessional ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Given Interview</p>
                <p className="text-gray-900">{mentee.givenInterview ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">UPSC Attempts</p>
                <p className="text-gray-900">{mentee.numberOfAttemptsInUpsc}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Mains Attempts</p>
                <p className="text-gray-900">{mentee.numberOfMainsAttempts}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Study Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Preferred Time Slots</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mentee.preferredSlots.map((slot) => (
                    <span key={slot} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Answer Writing Level</p>
                <p className="text-gray-900">{mentee.answerWritingLevel}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Weak Subjects</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mentee.weakSubjects.map((subject) => (
                    <span key={subject} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Strong Subjects</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mentee.strongSubjects.map((subject) => (
                    <span key={subject} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Previously Enrolled Courses</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mentee.previouslyEnrolledCourses.map((course) => (
                    <span key={course} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Primary Source of Current Affairs</p>
                <p className="text-gray-900">{mentee.primarySourceOfCurrentAffairs}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Expectation from Mentorship</p>
                <p className="text-gray-900">{mentee.expectationFromMentorshipCourse}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 