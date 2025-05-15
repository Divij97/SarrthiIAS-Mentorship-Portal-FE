'use client';

import { useState, useEffect } from 'react';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { StrippedDownMentor } from '@/types/mentor';
import { getAllMentorsFeedback } from '@/services/admin';
import { MentorFeedback } from '@/types/admin';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<MentorFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const authHeader = useAdminAuthStore((state) => state.getAuthHeader)();
  const adminData = useAdminAuthStore((state) => state.adminData);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMentorsFeedback(authHeader || '');
      setFeedbacks(response.feedbacksSortedByDate);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [authHeader]);

  const handleRefresh = () => {
    fetchFeedbacks();
  };

  const handleMentorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMentor(e.target.value);
  };

  const handleDownloadCSV = () => {
    // Define CSV headers
    const headers = [
      'Session Date',
      'Mentee Name',
      'Mentee Email',
      'Mentor Name',
      'Mentor Email',
      'Rating',
      'Satisfied',
      'Comments'
    ];

    // Convert feedbacks to CSV rows
    const csvRows = filteredFeedbacks.map(feedback => [
      feedback.sessionDate,
      feedback.mentee.n,
      feedback.mentee.e,
      feedback.mentor.name,
      feedback.mentor.email,
      feedback.rating,
      feedback.satisfied ? 'Yes' : 'No',
      `"${(feedback.additionalComments || '').replace(/"/g, '""')}"` // Add null check with default empty string
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFeedbacks = selectedMentor
    ? feedbacks.filter(feedback => feedback.mentor.email === selectedMentor)
    : feedbacks;

  // Sort feedbacks by submitTimestamp in descending order
  const sortedAndFilteredFeedbacks = [...filteredFeedbacks].sort((a, b) => {
    const parseTimestamp = (timestamp: string) => {
      const [datePart, timePart] = timestamp.split(' ');
      const [day, month, year] = datePart.split('/');
      const [time, period] = timePart.split(' ');
      const [hours, minutes] = time.split(':');
      
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hour,
        parseInt(minutes)
      );
    };

    return parseTimestamp(b.submitTimestamp).getTime() - parseTimestamp(a.submitTimestamp).getTime();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading feedbacks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Session Feedbacks</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedMentor}
            onChange={handleMentorChange}
            className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          >
            <option value="">All Mentors</option>
            {adminData?.mentors.map((mentor: StrippedDownMentor) => (
              <option key={mentor.phone} value={mentor.email}>
                {mentor.name} ({mentor.email})
              </option>
            ))}
          </select>
          <button
            onClick={handleDownloadCSV}
            disabled={filteredFeedbacks.length === 0}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              filteredFeedbacks.length === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Download CSV
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-orange-100 text-orange-700 hover:bg-orange-200"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center">
            <div className="text-gray-500 text-lg mb-2">No feedbacks found</div>
            <p className="text-gray-400 text-sm">
              {selectedMentor 
                ? "This mentor doesn't have any feedback yet."
                : "There are no feedbacks available at the moment."}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                    Submitted on
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                    Session Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                    Mentee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                    Mentor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                    Exam Knowledge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                    Politeness
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                    Punctuality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                    Satisfied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comments
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredFeedbacks.map((feedback, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.submitTimestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.sessionDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.mentee.n}
                      <div className="text-xs text-gray-500">{feedback.mentee.e}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.mentor.name}
                      <div className="text-xs text-gray-500">{feedback.mentor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.rating}/5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.examKnowledge !== -1 ? `${feedback.examKnowledge}/5` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        feedback.politeness ? (feedback.politeness === 'Polite' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-800'
                      }`}>
                        {feedback.politeness ? (feedback.politeness === 'Not' ? 'Not Polite' : feedback.politeness) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        feedback.delayed !== undefined ? (!feedback.delayed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-800'
                      }`}>
                        {feedback.delayed !== undefined ? (feedback.delayed ? 'Delayed' : 'On Time') : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        feedback.satisfied ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {feedback.satisfied ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 break-words whitespace-normal">
                      {feedback.additionalComments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 