'use client';

import { useState, useEffect } from 'react';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { getSupportQueries, updateSupportQuery } from '@/services/mentee';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { SupportQuery, UpdateSupportQueryRequest } from '@/types/mentee';
export default function SupportQueriesPage() {
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<SupportQuery | null>(null);
  const [response, setResponse] = useState('');
  const [isResolved, setIsResolved] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const getAuthHeader = useAdminAuthStore((state) => state.getAuthHeader);

  const fetchQueries = async () => {
    try {
      const data = await getSupportQueries(getAuthHeader(), showResolved);
      // Sort queries by submitTimestamp in descending order
      const sortedQueries = [...(data.supportRequests || [])].sort((a, b) => {
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
      setQueries(sortedQueries);
    } catch (error) {
      console.error('Error fetching support queries:', error);
      toast.error('Failed to fetch support queries');
      setQueries([]); // Set empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // Add new useEffect to watch showResolved state
  useEffect(() => {
    fetchQueries();
  }, [showResolved]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQueries();
  };

  const handleRespond = (query: SupportQuery) => {
    setSelectedQuery(query);
    setResponse(query.response || '');
    setIsResolved(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedQuery) return;

    setIsSubmitting(true);
    try {
      const request: UpdateSupportQueryRequest = {
        response,
        resolved: isResolved,
        issue: selectedQuery.issue,
      };

      await updateSupportQuery(selectedQuery.id, request, getAuthHeader());
      
      // Update the local state
      setQueries(queries.map(q => 
        q.id === selectedQuery.id 
          ? { ...q, response, resolved: isResolved }
          : q
      ));

      toast.success('Response submitted successfully');
      setSelectedQuery(null);
      setResponse('');
      setIsResolved(true);
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Separate queries into resolved and unresolved
  const unresolvedQueries = queries.filter(query => !query.resolved);
  const resolvedQueries = queries.filter(query => query.resolved);

  const renderQueriesTable = (queries: SupportQuery[], title: string) => {
    if (queries.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Query
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queries.map((query) => (
                  <tr key={query.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{query.menteeName}</div>
                      <div className="text-sm text-gray-500">{query.menteeEmail}</div>
                      <div className="text-sm text-gray-500">{query.menteePhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{query.course}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-pre-wrap">{query.issue}</div>
                      {query.response && (
                        <div className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
                          <span className="font-medium">Response: </span>
                          {query.response}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {query.resolved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {query.submitTimestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRespond(query)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        {query.response ? 'Update Response' : 'Respond'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900">Support Queries</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showResolved"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="showResolved" className="ml-2 block text-sm text-gray-900">
              Show resolved queries
            </label>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Support Queries Lists */}
      <div className="space-y-8">
        {renderQueriesTable(unresolvedQueries, "Pending Queries")}
        {showResolved && renderQueriesTable(resolvedQueries, "Resolved Queries")}
        
        {queries.length === 0 && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 text-center text-gray-500">
            <p>No support queries found.</p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Respond to Query</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Query</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedQuery.issue}
                </div>
              </div>

              <div>
                <label htmlFor="response" className="block text-sm font-medium text-gray-700">
                  Response
                </label>
                <textarea
                  id="response"
                  rows={4}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter your response..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isResolved"
                  checked={isResolved}
                  onChange={(e) => setIsResolved(e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isResolved" className="ml-2 block text-sm text-gray-900">
                  Mark as resolved
                </label>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedQuery(null);
                  setResponse('');
                  setIsResolved(true);
                }}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitResponse}
                disabled={isSubmitting || !response.trim()}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 