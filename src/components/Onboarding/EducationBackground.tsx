'use client';

import { useState, useEffect, useMemo } from 'react';
import { FormData } from '@/types/multistep-form';
import { OptionalSubject, OptionalSubjectLabels, ReservationCategory } from '@/types/mentee';
import { FormErrors } from '@/utils/mentee-signup-form-validator';

interface EducationBackgroundProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  errors?: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors | undefined>>;
  onValidationChange?: (isValid: boolean) => void;
}

// Get reservation categories from enum
const reservationCategories = Object.values(ReservationCategory)
  .filter(category => category !== ReservationCategory.SC && category !== ReservationCategory.ST)
  .map(category => ({
    value: category,
    label: category === ReservationCategory.OBC ? 'OBC' : 
           category === ReservationCategory.SC_ST ? 'SC/ST' : 'General'
  }));

const EducationBackground = ({ formData, handleChange, errors, setErrors, onValidationChange }: EducationBackgroundProps) => {
  const [subjectInput, setSubjectInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSubjects, setFilteredSubjects] = useState<{ value: OptionalSubject; label: string }[]>([]);
  const [isValidSubject, setIsValidSubject] = useState(false);

  useEffect(() => {
    if (formData.optionalSubject) {
      setSubjectInput(OptionalSubjectLabels[formData.optionalSubject]);
    }
  }, [formData.optionalSubject]);

  useEffect(() => {
    if (subjectInput.length > 0) {
      const filtered = Object.entries(OptionalSubjectLabels)
        .filter(([_, label]) => 
          label.toLowerCase().includes(subjectInput.toLowerCase())
        )
        .map(([value, label]) => ({
          value: value as OptionalSubject,
          label
        }));
      setFilteredSubjects(filtered);
      if (subjectInput !== "Not Decided yet") {
        setShowSuggestions(true);
      }
      
    } else {
      setFilteredSubjects([]);
      setShowSuggestions(false);
    }
  }, [subjectInput]);

  // Validate subject input
  useEffect(() => {
    const isValid = Object.values(OptionalSubjectLabels).includes(subjectInput);
    setIsValidSubject(isValid);
    onValidationChange?.(isValid);
  }, [subjectInput, onValidationChange]);

  const handleSuggestionClick = (subject: { value: OptionalSubject; label: string }) => {
    setSubjectInput(subject.label);
    setShowSuggestions(false);
    handleChange('optionalSubject')({
      target: { value: subject.value }
    } as React.ChangeEvent<HTMLInputElement>);
    if (errors?.optionalSubject) {
      const newErrors = { ...errors };
      delete newErrors.optionalSubject;
      setErrors(newErrors);
    }
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
      <h2 className="text-2xl font-bold text-gray-900">Education Background</h2>
      <p className="text-gray-600">Tell us about your educational background</p>
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
            {reservationCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors?.reservationCategory && (
            <p className="mt-1 text-sm text-red-600">{errors.reservationCategory}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="optionalSubject" className="block text-sm font-medium text-gray-700">
            Optional Subject
          </label>
          <div className="relative">
            <input
              type="text"
              id="optionalSubject"
              value={subjectInput}
              onChange={(e) => {
                setSubjectInput(e.target.value);
              }}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 ${
                !isValidSubject && subjectInput ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Search for your optional subject..."
              required
            />
            {!isValidSubject && subjectInput && (
              <p className="mt-1 text-sm text-red-600">Please select a valid optional subject from the suggestions</p>
            )}
            {showSuggestions && filteredSubjects.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                {filteredSubjects.map((subject) => (
                  <div
                    key={subject.value}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(subject)}
                  >
                    {subject.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors?.optionalSubject && (
            <p className="mt-1 text-sm text-red-600">{errors.optionalSubject}</p>
          )}
        </div>

        <div>
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