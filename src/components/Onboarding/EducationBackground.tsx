'use client';

import { useState, useEffect } from 'react';
import { FormData } from '@/types/multistep-form';
import { OptionalSubject, ReservationCategory } from '@/types/mentee';
import { FormErrors } from '@/utils/mentee-signup-form-validator';

interface EducationBackgroundProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  errors?: FormErrors;
}

// Get reservation categories from enum
const reservationCategories = Object.values(ReservationCategory).map(category => ({
  value: category,
  label: category === ReservationCategory.OBC ? 'OBC' : 
         category === ReservationCategory.SC ? 'SC' : 
         category === ReservationCategory.ST ? 'ST' : 'General'
}));

// Get all valid optional subjects from the enum with key and display value
const optionalSubjects: Array<{key: string, value: OptionalSubject, label: string}> = Object.entries(OptionalSubject).map(([key, value]) => ({
  key,
  value: value as OptionalSubject,
  label: value
}));

const EducationBackground = ({ formData, handleChange, errors }: EducationBackgroundProps) => {
  // Find the display label for the current optionalSubject value
  const getCurrentSubjectLabel = () => {
    if (!formData.optionalSubject) return '';
    const subject = optionalSubjects.find(s => s.key === formData.optionalSubject || s.value === formData.optionalSubject);
    return subject ? subject.label : '';
  };

  const [subjectInput, setSubjectInput] = useState(getCurrentSubjectLabel());
  const [suggestions, setSuggestions] = useState<Array<{key: string, value: OptionalSubject, label: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidSubject, setIsValidSubject] = useState(true);

  // Update the input field if formData.optionalSubject changes from outside
  useEffect(() => {
    setSubjectInput(getCurrentSubjectLabel());
  }, [formData.optionalSubject]);

  // Function to validate if a subject is valid
  const validateSubject = (subject: string): boolean => {
    return optionalSubjects.some(opt => opt.label === subject);
  };

  // Function to get suggestions based on input
  const getSuggestions = (input: string): Array<{key: string, value: OptionalSubject, label: string}> => {
    const inputValue = input.toLowerCase();
    return optionalSubjects.filter(subject =>
      subject.label.toLowerCase().includes(inputValue)
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

    // Don't update form data yet, wait for selection
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (subjectOption: {key: string, value: OptionalSubject, label: string}) => {
    setSubjectInput(subjectOption.label);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsValidSubject(true);

    // Create a custom event to update form data with the enum KEY (not value)
    // This is critical - the server expects the enum key (HISTORY), not the display value (History)
    const event = {
      target: { value: subjectOption.key }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange('optionalSubject')(event);
  };

  // Handle reservation category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectValue = e.target.value;
    
    // Find the matching enum value
    const enumValue = Object.values(ReservationCategory).find(
      category => category === selectValue
    );
    
    // Create a custom event with the enum value
    if (enumValue) {
      const customEvent = {
        ...e,
        target: {
          ...e.target,
          value: enumValue
        }
      };
      handleChange('reservationCategory')(customEvent);
    } else {
      // Pass the original event if no matching enum value
      handleChange('reservationCategory')(e);
    }
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
      <p className="text-sm font-medium text-red-600">* All fields are required</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="reservationCategory" className="block text-sm font-medium text-gray-700">
            Reservation Category
          </label>
          <select
            id="reservationCategory"
            value={formData.reservationCategory}
            onChange={handleCategoryChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="">Select Category</option>
            {reservationCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
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
                  {subject.label}
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
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
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