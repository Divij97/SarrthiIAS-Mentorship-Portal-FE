'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { UserType } from '@/types/auth';
import { SupportQuery } from '@/types/mentee';
import { getUserSupportQueries } from '@/services/mentee';
import { PlusIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SupportQueryForm from '@/components/Home/SupportQueryForm';

export default function SupportQueriesPage() {
  const router = useRouter();
  const { isAuthenticated, userType, authHeader } = useLoginStore();
  const { menteeResponse } = useMenteeStore();
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || userType !== UserType.MENTEE) {
      router.replace('/login');
    }
  }, [isAuthenticated, userType, router]);

  const fetchQueries = async () => {
    if (!menteeResponse?.username || !authHeader) return;
    
    try {
      setLoading(true);
      const response = await getUserSupportQueries(authHeader, menteeResponse.username);
      // Sort queries by submitTimestamp in descending order
      const sortedQueries = [...(response.supportRequests || [])].sort((a, b) => {
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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (menteeResponse?.username && authHeader) {
      fetchQueries();
    }
  }, [menteeResponse?.username, authHeader]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchQueries();
  };

  if (!isAuthenticated || userType !== UserType.MENTEE || !menteeResponse?.mentee) {
    return null;
  }

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Raise a Support Query</h2>
          <button
            onClick={() => setShowCreateForm(false)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Back to List
          </button>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <SupportQueryForm 
            mentee={menteeResponse.mentee} 
            onSuccess={() => {
              setShowCreateForm(false);
              fetchQueries();
            }}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading support queries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Support Queries</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Query
          </button>
        </div>
      </div>

      {queries.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">No support queries found</p>
            <p className="text-gray-400 text-sm">Click the Create Query button to raise a new support query.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queries.map((query) => (
                  <tr key={query.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {query.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-wrap">
                      {query.issue}
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
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-wrap">
                      {query.response || 'No response yet'}
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