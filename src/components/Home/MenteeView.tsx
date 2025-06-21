import { Mentee, ReservationCategory, Region, Gender, OptionalSubject, OptionalSubjectLabels, AnswerWritingLevel, MenteeUpscExperience, MenteeWithAuth } from '@/types/mentee';
import { useState } from 'react';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { updateMentee } from '@/services/mentee';
import { SHA256 } from 'crypto-js';

interface MenteeViewProps {
  mentee: Mentee;
}

// Helper function to convert reservation category to display format
const getCategoryDisplay = (category: ReservationCategory): string => {
  switch (category) {
    case ReservationCategory.OBC:
      return 'OBC';
    case ReservationCategory.SC_ST:
    case ReservationCategory.SC:
    case ReservationCategory.ST:
      return 'SC/ST';
    case ReservationCategory.GENERAL:
    default:
      return 'General';
  }
};

export default function MenteeView({ mentee }: MenteeViewProps) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    n: mentee.n,
    e: mentee.e,
    region: mentee.region,
    gender: mentee.gender,
    category: mentee.category,
    optionalSubject: mentee.optionalSubject,
    isWorkingProfessional: mentee.isWorkingProfessional,
    givenInterview: mentee.givenInterview,
    numberOfAttemptsInUpsc: mentee.numberOfAttemptsInUpsc,
    numberOfMainsAttempts: mentee.numberOfMainsAttempts,
    answerWritingLevel: mentee.answerWritingLevel,
    weakSubjects: mentee.weakSubjects.join(', '),
    strongSubjects: mentee.strongSubjects.join(', '),
    previouslyEnrolledCourses: mentee.previouslyEnrolledCourses.join(', '),
    primarySourceOfCurrentAffairs: mentee.primarySourceOfCurrentAffairs,
    expectationFromMentorshipCourse: mentee.expectationFromMentorshipCourse,
    menteeUpscExperience: mentee.menteeUpscExperience || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getAuthHeader = useLoginStore((state) => state.getAuthHeader);
  const password = useLoginStore((state) => state.password);
  const isTempPassword = useLoginStore((state) => state.isAuthenticated ? false : true); // fallback
  const menteeStore = useMenteeStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      n: mentee.n,
      e: mentee.e,
      region: mentee.region,
      gender: mentee.gender,
      category: mentee.category,
      optionalSubject: mentee.optionalSubject,
      isWorkingProfessional: mentee.isWorkingProfessional,
      givenInterview: mentee.givenInterview,
      numberOfAttemptsInUpsc: mentee.numberOfAttemptsInUpsc,
      numberOfMainsAttempts: mentee.numberOfMainsAttempts,
      answerWritingLevel: mentee.answerWritingLevel,
      weakSubjects: mentee.weakSubjects.join(', '),
      strongSubjects: mentee.strongSubjects.join(', '),
      previouslyEnrolledCourses: mentee.previouslyEnrolledCourses.join(', '),
      primarySourceOfCurrentAffairs: mentee.primarySourceOfCurrentAffairs,
      expectationFromMentorshipCourse: mentee.expectationFromMentorshipCourse,
      menteeUpscExperience: mentee.menteeUpscExperience || '',
    });
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const authHeader = getAuthHeader();
      if (!authHeader) throw new Error('Not authenticated');
      const passwordSHA = SHA256(password).toString();
      const payload: MenteeWithAuth = {
        mentee: {
          ...mentee,
          ...form,
          weakSubjects: form.weakSubjects.split(',').map(s => s.trim()).filter(Boolean),
          strongSubjects: form.strongSubjects.split(',').map(s => s.trim()).filter(Boolean),
          previouslyEnrolledCourses: form.previouslyEnrolledCourses.split(',').map(s => s.trim()).filter(Boolean),
          menteeUpscExperience: form.menteeUpscExperience ? form.menteeUpscExperience as MenteeUpscExperience : menteeStore.menteeResponse?.mentee?.menteeUpscExperience || undefined,
          p: mentee.p,
        },
        username: mentee.p,
        passwordSHA,
        isTempPassword: menteeStore.menteeResponse?.isTempPassword || isTempPassword,
        enrolledCourses: menteeStore.menteeResponse?.enrolledCourses || [],
      };
      await updateMentee(payload, authHeader);
      // Optionally refresh mentee data from backend, or update store
      menteeStore.setMenteeResponse({
        ...menteeStore.menteeResponse!,
        mentee: {
          ...mentee,
          ...form,
          weakSubjects: form.weakSubjects.split(',').map(s => s.trim()).filter(Boolean),
          strongSubjects: form.strongSubjects.split(',').map(s => s.trim()).filter(Boolean),
          previouslyEnrolledCourses: form.previouslyEnrolledCourses.split(',').map(s => s.trim()).filter(Boolean),
          menteeUpscExperience: form.menteeUpscExperience ? form.menteeUpscExperience as MenteeUpscExperience : undefined,
          p: mentee.p,
        },
      });
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome, {mentee.n}!</h1>
      <div className="flex justify-end mb-2">
        {!editMode ? (
          <button onClick={handleEdit} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Edit</button>
        ) : (
          <>
            <button onClick={handleCancel} className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </>
        )}
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900 break-words">{mentee.e}</p>
                ) : (
                  <input
                    type="email"
                    name="e"
                    value={form.e}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Phone</p>
                <p className="text-sm sm:text-base text-gray-900">{mentee.p}</p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Region</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{mentee.region}</p>
                ) : (
                  <select
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="NORTH">North</option>
                    <option value="SOUTH">South</option>
                    <option value="EAST">East</option>
                    <option value="WEST">West</option>
                    <option value="CENTRAL">Central</option>
                  </select>
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Gender</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{mentee.gender}</p>
                ) : (
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Category</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{getCategoryDisplay(mentee.category)}</p>
                ) : (
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="GENERAL">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="SC_ST">SC/ST</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Preparation Background</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Optional Subject</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{OptionalSubjectLabels[mentee.optionalSubject]}</p>
                ) : (
                  <select
                    name="optionalSubject"
                    value={form.optionalSubject}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    {Object.entries(OptionalSubjectLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Working Professional</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{mentee.isWorkingProfessional ? 'Yes' : 'No'}</p>
                ) : (
                  <input
                    type="checkbox"
                    name="isWorkingProfessional"
                    checked={form.isWorkingProfessional}
                    onChange={handleChange}
                    className="mr-2"
                  />
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Given Interview</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{mentee.givenInterview ? 'Yes' : 'No'}</p>
                ) : (
                  <input
                    type="checkbox"
                    name="givenInterview"
                    checked={form.givenInterview}
                    onChange={handleChange}
                    className="mr-2"
                  />
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">UPSC Attempts</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{mentee.numberOfAttemptsInUpsc}</p>
                ) : (
                  <input
                    type="number"
                    name="numberOfAttemptsInUpsc"
                    value={form.numberOfAttemptsInUpsc}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Mains Attempts</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{mentee.numberOfMainsAttempts}</p>
                ) : (
                  <input
                    type="number"
                    name="numberOfMainsAttempts"
                    value={form.numberOfMainsAttempts}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Study Preferences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Answer Writing Level</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{mentee.answerWritingLevel || 'Just started Preparation'}</p>
                ) : (
                  <select
                    name="answerWritingLevel"
                    value={form.answerWritingLevel}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Weak Subjects</p>
                {!editMode ? (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                    {mentee.weakSubjects && mentee.weakSubjects.length > 0 ? (
                      mentee.weakSubjects.map((subject) => (
                        <span key={subject} className="px-2 py-0.5 sm:py-1 bg-red-100 text-red-800 rounded text-xs sm:text-sm">
                          {subject}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    name="weakSubjects"
                    value={form.weakSubjects}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="Comma separated subjects"
                  />
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Strong Subjects</p>
                {!editMode ? (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                    {mentee.strongSubjects && mentee.strongSubjects.length > 0 ? (
                      mentee.strongSubjects.map((subject) => (
                        <span key={subject} className="px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded text-xs sm:text-sm">
                          {subject}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    name="strongSubjects"
                    value={form.strongSubjects}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="Comma separated subjects"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Additional Information</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Previously Enrolled Courses</p>
                {!editMode ? (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                    {mentee.previouslyEnrolledCourses && mentee.previouslyEnrolledCourses.length > 0 ? (
                      mentee.previouslyEnrolledCourses.map((course) => (
                        <span key={course} className="px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded text-xs sm:text-sm">
                          {course}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">None</span>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    name="previouslyEnrolledCourses"
                    value={form.previouslyEnrolledCourses}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="Comma separated courses"
                  />
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Primary Source of Current Affairs</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{mentee.primarySourceOfCurrentAffairs || 'Not specified'}</p>
                ) : (
                  <input
                    type="text"
                    name="primarySourceOfCurrentAffairs"
                    value={form.primarySourceOfCurrentAffairs}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Expectation from Mentorship</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{mentee.expectationFromMentorshipCourse || 'Not specified'}</p>
                ) : (
                  <textarea
                    name="expectationFromMentorshipCourse"
                    value={form.expectationFromMentorshipCourse}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    rows={2}
                  />
                )}
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-500">UPSC Experience</p>
                {!editMode ? (
                  <p className="text-sm sm:text-base text-gray-900">{mentee.menteeUpscExperience || 'Not specified'}</p>
                ) : (
                  <select
                    name="menteeUpscExperience"
                    value={form.menteeUpscExperience}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Select Experience</option>
                    <option value="JUST_STARTED_PREPARATION">Just Started Preparation</option>
                    <option value="FINISHED_FOUNDATION_COACHING_GIVEN_1_ATTEMPT">Finished Foundation Coaching, Given 1 Attempt</option>
                    <option value="GIVEN_MULTIPLE_PRELIMS_ATTEMPTS">Given Multiple Prelims Attempts</option>
                    <option value="GIVEN_1_OR_MORE_MAINS">Given 1 or More Mains</option>
                    <option value="INTERVIEW_GIVEN">Interview Given</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 