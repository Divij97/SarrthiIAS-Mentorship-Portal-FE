'use client';

import { FormData } from '../MultiStepForm';

interface CurrentPreparationProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleArrayChange: (field: 'weakSubjects' | 'strongSubjects') => (value: string[]) => void;
}

const currentAffairsSources = ['Newspaper', 'Magazine', 'YouTube', 'Hybrid'];
const answerWritingLevels = ['Need Support', 'Average', 'Fairly Good'];
const commonSubjects = [
  'History',
  'Geography',
  'Polity',
  'Economics',
  'Science & Technology',
  'Environment',
  'Current Affairs',
  'Ethics'
];

const CurrentPreparation = ({ 
  formData, 
  handleChange,
  handleArrayChange 
}: CurrentPreparationProps) => {
  const handleSubjectSelection = (
    field: 'weakSubjects' | 'strongSubjects',
    subject: string
  ) => {
    const currentSubjects = formData[field];
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject];
    handleArrayChange(field)(newSubjects);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Current Preparation Details</h2>
      <p className="text-gray-600">Tell us about your current preparation status</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="previousScores" className="block text-sm font-medium text-gray-700">
            Previous Attempt Scores
          </label>
          <textarea
            id="previousScores"
            value={formData.previousScores}
            onChange={handleChange('previousScores')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="Please provide details of scores in previous attempts"
          />
        </div>

        <div>
          <label htmlFor="currentAffairsSource" className="block text-sm font-medium text-gray-700">
            Primary Source of Current Affairs
          </label>
          <select
            id="currentAffairsSource"
            value={formData.currentAffairsSource}
            onChange={handleChange('currentAffairsSource')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="">Select Source</option>
            {currentAffairsSources.map((source) => (
              <option key={source} value={source.toLowerCase()}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="answerWritingSkills" className="block text-sm font-medium text-gray-700">
            Answer Writing Skills
          </label>
          <select
            id="answerWritingSkills"
            value={formData.answerWritingSkills}
            onChange={handleChange('answerWritingSkills')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="">Select Level</option>
            {answerWritingLevels.map((level) => (
              <option key={level} value={level.toLowerCase()}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weak Subjects
          </label>
          <div className="grid grid-cols-2 gap-2">
            {commonSubjects.map((subject) => (
              <div key={subject} className="flex items-center">
                <input
                  type="checkbox"
                  id={`weak-${subject}`}
                  checked={formData.weakSubjects.includes(subject)}
                  onChange={() => handleSubjectSelection('weakSubjects', subject)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`weak-${subject}`} className="ml-2 text-sm text-gray-700">
                  {subject}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Strong Subjects
          </label>
          <div className="grid grid-cols-2 gap-2">
            {commonSubjects.map((subject) => (
              <div key={subject} className="flex items-center">
                <input
                  type="checkbox"
                  id={`strong-${subject}`}
                  checked={formData.strongSubjects.includes(subject)}
                  onChange={() => handleSubjectSelection('strongSubjects', subject)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`strong-${subject}`} className="ml-2 text-sm text-gray-700">
                  {subject}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPreparation; 