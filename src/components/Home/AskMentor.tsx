'use client';

import { useState } from 'react';

const categories = [
  'General Preparation Strategy',
  'Subject Specific Queries',
  'Answer Writing',
  'Current Affairs',
  'Optional Subject',
  'Previous Year Questions'
];

const AskMentor = () => {
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ category, question });
  };

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ask Your Mentor</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Select Category
            </label>
            <select
              id="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="" disabled>Select an option</option>
              <option value="subject">Subject Related</option>
              <option value="exam">Exam Strategy</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">
              Question
            </label>
            <textarea
              id="question"
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Type your question here..."
            />
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskMentor; 