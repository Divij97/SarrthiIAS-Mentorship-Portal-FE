'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CriterionCategory, CriterionSubCategoryRequest } from '@/types/admin';

interface GroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: GroupFormData) => void;
  courseName: string;
}

export interface GroupFormData {
  groupFriendlyName: string;
  criterion: CriterionSubCategoryRequest;
}

interface SubCategoryState {
  name: string;
  min?: number;
  max?: number;
  value?: OptionalSubCategoryList;
}

enum OptionalSubCategoryList {
  POLITICAL_SCIENCE_AND_INTERNATIONAL_RELATIONS = 'POLITICAL_SCIENCE_AND_INTERNATIONAL_RELATIONS',
  SOCIOLOGY = 'SOCIOLOGY',
  ANTHROPOLOGY = 'ANTHROPOLOGY',
  SCIENCE = 'SCIENCE',
  OTHERS = 'OTHERS'
}

export default function GroupForm({ isOpen, onClose, onSubmit, courseName }: GroupFormProps) {
  const [formData, setFormData] = useState<{
    groupId: string;
    criterion: {
      category: CriterionCategory;
      subCategories: SubCategoryState[];
    };
  }>({
    groupId: '',
    criterion: {
      category: CriterionCategory.DEFAULT,
      subCategories: []
    }
  });
  
  const [error, setError] = useState<string | null>(null);

  const formatSubCategories = (subCategories: SubCategoryState[]): string[] | null => {
    if (subCategories.length === 0) return null;

    const formattedCategories = subCategories.map(sc => {
      if (sc.name === 'Optional' && sc.value) {
        return `Optional:${sc.value}`;
      } else {
        const min = sc.min ?? 0;
        const max = sc.max !== undefined ? sc.max : '';
        return `${sc.name}:${min}-${max}`;
      }
    });

    console.log('Original subcategories:', subCategories);
    console.log('Formatted subcategories:', formattedCategories);
    return formattedCategories;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.groupId.trim()) {
      setError('Group ID is required');
      return;
    }

    if (formData.criterion.subCategories.length > 2) {
      setError('Maximum 2 sub-categories are allowed');
      return;
    }

    // Format the data for submission
    const submissionData: GroupFormData = {
      groupFriendlyName: formData.groupId,
      criterion: {
        category: formData.criterion.category,
        subCategories: formatSubCategories(formData.criterion.subCategories)
      }
    };
    
    console.log('Final submission data:', submissionData);
    setError(null);
    onSubmit(submissionData);
    onClose();
  };

  const handleAddSubCategory = (name: string) => {
    if (formData.criterion.subCategories.length >= 2) {
      setError('Maximum 2 sub-categories are allowed');
      return;
    }

    if (formData.criterion.subCategories.find(sc => sc.name === name)) {
      setError('This sub-category is already added');
      return;
    }

    setFormData(prev => ({
      ...prev,
      criterion: {
        ...prev.criterion,
        subCategories: [
          ...prev.criterion.subCategories,
          { name, min: 0 }
        ]
      }
    }));
    setError(null);
  };

  const handleRemoveSubCategory = (name: string) => {
    setFormData(prev => ({
      ...prev,
      criterion: {
        ...prev.criterion,
        subCategories: prev.criterion.subCategories.filter(sc => sc.name !== name)
      }
    }));
    setError(null);
  };

  const handleSubCategoryChange = (name: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      criterion: {
        ...prev.criterion,
        subCategories: prev.criterion.subCategories.map(sc => 
          sc.name === name ? { ...sc, [field]: value } : sc
        )
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Group</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={formData.groupId}
              onChange={(e) => setFormData(prev => ({ ...prev, groupId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              placeholder="Set a descriptive name for this group"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.criterion.category}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                criterion: { ...prev.criterion, category: e.target.value as CriterionCategory }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
            >
              {Object.values(CriterionCategory).map(category => (
                <option key={category} value={category}>
                  {category.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Categories
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAddSubCategory('Optional')}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 mr-2"
              >
                Add Optional Subject
              </button>
              <button
                type="button"
                onClick={() => handleAddSubCategory('MainAttempts')}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 mr-2"
              >
                Add Main Attempts
              </button>
              <button
                type="button"
                onClick={() => handleAddSubCategory('Attempts')}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Add Attempts
              </button>
            </div>
          </div>

          {formData.criterion.subCategories.map((subCategory, index) => (
            <div key={index} className="border rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{subCategory.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubCategory(subCategory.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              
              {subCategory.name === 'Optional' ? (
                <select
                  value={subCategory.value || ''}
                  onChange={(e) => handleSubCategoryChange(subCategory.name, 'value', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                  required
                >
                  <option value="">Select Optional Subject</option>
                  {Object.values(OptionalSubCategoryList).map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex space-x-2">
                  <div>
                    <label className="block text-sm text-gray-600">Min</label>
                    <input
                      type="number"
                      min="0"
                      value={subCategory.min ?? 0}
                      onChange={(e) => handleSubCategoryChange(subCategory.name, 'min', parseInt(e.target.value))}
                      className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Max (optional)</label>
                    <input
                      type="number"
                      min={subCategory.min ?? 0}
                      value={subCategory.max ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                        handleSubCategoryChange(subCategory.name, 'max', value);
                      }}
                      className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Creating a new group for course: <span className="font-medium">{courseName}</span>
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 