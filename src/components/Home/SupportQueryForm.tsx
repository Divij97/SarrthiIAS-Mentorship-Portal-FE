'use client';

import { useState } from 'react';
import { Mentee, SupportQueryRequest, SupportQueryCategory } from '@/types/mentee';
import { submitSupportQuery } from '@/services/mentee';
import { useLoginStore } from '@/stores/auth/store';
import { toast } from 'react-hot-toast';

interface SupportQueryFormProps {
  mentee: Mentee;
  onSuccess?: () => void;
}

type QueryCategory = 'General' | 'Tech' | 'Mentor' | 'Other';

interface SupportQueryFormData {
  name: string;
  mobileNumber: string;
  email: string;
  course: string;
  category: QueryCategory;
  issue: string;
}

export default function SupportQueryForm({ mentee, onSuccess }: SupportQueryFormProps) {
  const authHeader = useLoginStore((state) => state.authHeader);
  const [formData, setFormData] = useState<SupportQueryFormData>({
    name: mentee.n,
    mobileNumber: mentee.p,
    email: mentee.e,
    course: '',
    category: 'General',
    issue: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supportQueryRequest: SupportQueryRequest = {
        menteeName: mentee.n,
        phone: mentee.p,
        email: mentee.e,
        course: formData.course,
        category: formData.category as SupportQueryCategory,
        issue: formData.issue,
      };
      await submitSupportQuery(supportQueryRequest, authHeader);
      toast.success('Support query submitted successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            readOnly
          />
        </div>

        {/* Mobile Number Field */}
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="tel"
            name="mobileNumber"
            id="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            readOnly
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            readOnly
          />
        </div>

        {/* Course Field */}
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700">
            Course
          </label>
          <input
            type="text"
            name="course"
            id="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="Enter course name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          >
            <option value="General">General</option>
            <option value="Tech">Tech</option>
            <option value="Mentor">Mentor</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Issue Field */}
      <div>
        <label htmlFor="issue" className="block text-sm font-medium text-gray-700">
          Issue
        </label>
        <textarea
          name="issue"
          id="issue"
          rows={4}
          value={formData.issue}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          placeholder="Please describe your issue in detail..."
          required
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Submit Query
        </button>
      </div>
    </form>
  );
} 