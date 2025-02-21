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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Select an option</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-gray-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">
              Question
            </label>
            <textarea
              id="question"
              rows={6}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              placeholder="Type your question here..."
            />
          </div>

          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
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