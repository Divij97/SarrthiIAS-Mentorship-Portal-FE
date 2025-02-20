'use client';

import { useState, useEffect } from 'react';
import { FormData } from '../MultiStepForm';
import { OptionalSubject } from '@/types/mentee';

interface EducationBackgroundProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const reservationCategories = ['General', 'OBC', 'SC/ST'];

// Get all valid optional subjects from the enum
const optionalSubjects: string[] = Object.values(OptionalSubject);

const EducationBackground = ({ formData, handleChange }: EducationBackgroundProps) => {
  const [subjectInput, setSubjectInput] = useState(formData.optionalSubject || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidSubject, setIsValidSubject] = useState(true);

  // Function to validate if a subject is valid
  const validateSubject = (subject: string): boolean => {
    return optionalSubjects.includes(subject);
  };

  // Function to get suggestions based on input
  const getSuggestions = (input: string): string[] => {
    const inputValue = input.toLowerCase();
    return optionalSubjects.filter(subject =>
      subject.toLowerCase().includes(inputValue)
    );
  };

  // Handle input change
  const handleSubjectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubjectInput(value);
    
    if (value.length > 0) {
      const newSuggestions = getSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Validate the input
    setIsValidSubject(value === '' || validateSubject(value));

    // Update form data
    const event = {
      target: { value }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange('optionalSubject')(event);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (subject: string) => {
    setSubjectInput(subject);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsValidSubject(true);

    // Update form data
    const event = {
      target: { value: subject }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange('optionalSubject')(event);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
      <p className="text-gray-600">Please provide these additional details</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="reservationCategory" className="block text-sm font-medium text-gray-700">
            Reservation Category
          </label>
          <select
            id="reservationCategory"
            value={formData.reservationCategory}
            onChange={handleChange('reservationCategory')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="">Select Category</option>
            {reservationCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label htmlFor="optionalSubject" className="block text-sm font-medium text-gray-700">
            Optional Subject
          </label>
          <input
            type="text"
            id="optionalSubject"
            value={subjectInput}
            onChange={handleSubjectInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              isValidSubject 
                ? 'border-gray-300' 
                : 'border-red-300 focus:border-red-500 focus:ring-red-500'
            }`}
            required
            autoComplete="off"
          />
          {!isValidSubject && (
            <p className="mt-1 text-sm text-red-600">
              Please select a valid optional subject from the suggestions
            </p>
          )}
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {suggestions.map((subject, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                  onClick={() => handleSelectSuggestion(subject)}
                >
                  {subject}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Professional Status
          </label>
          <div className="mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isWorkingProfessional"
                checked={formData.isWorkingProfessional}
                onChange={handleChange('isWorkingProfessional')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isWorkingProfessional" className="ml-2 block text-sm text-gray-700">
                I am a working professional
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationBackground; 