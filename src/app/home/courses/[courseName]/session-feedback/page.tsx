'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StarRating } from '@/components/ui/StarRating';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { SubmitFeedbackRequest } from '@/types/mentee';
import { submitFeedback } from '@/services/mentee';
import { toast } from 'react-hot-toast';
interface FeedbackFormData {
  sessionDate: string;
  rating: number;
  additionalComments: string;
  satisfied: boolean;
}

export default function SessionFeedbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, getAuthHeader } = useLoginStore();
  const { menteeResponse } = useMenteeStore();
  const sessionDate = searchParams.get('sessionDate') || '';
  const courseName = searchParams.get('courseName') || '';

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const [formData, setFormData] = useState<FeedbackFormData>({
    sessionDate,
    rating: 0,
    additionalComments: '',
    satisfied: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to submit feedback
    console.log('Submitting feedback:', formData);
    try {
        const authHeader = getAuthHeader();
        const submitFeedbackRequest: SubmitFeedbackRequest = {
            mentor: menteeResponse.assignedMentor,
            mentee: {
                n: menteeResponse.mentee.n,
                p: menteeResponse.mentee.p,
                e: menteeResponse.mentee.e,
                iu: menteeResponse.mentee.iu,
            },
            feedback: {
                sessionDate,
                rating: formData.rating,
                additionalComments: formData.additionalComments,
                satisfied: formData.satisfied,
            }
        };
        await submitFeedback(submitFeedbackRequest, authHeader);
        toast.success('Feedback submitted successfully');
        setTimeout(() => {
          router.back();
        }, 1000);
    } catch (error) {
        console.error('Error submitting feedback:', error);
        toast.error('Error submitting feedback, Please try again');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={handleBack}
        className="mb-6 text-orange-600 hover:text-orange-700 font-medium flex items-center"
      >
        ← Back to Course
      </button>
      
      <h1 className="text-2xl font-bold mb-6">Session Feedback</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Date
          </label>
          <input
            type="text"
            value={formData.sessionDate}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rate your experience
          </label>
          <StarRating
            value={formData.rating}
            onChange={(rating) => setFormData({ ...formData, rating })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Were you satisfied with the session experience?
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={formData.satisfied}
                onChange={() => setFormData({ ...formData, satisfied: true })}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={!formData.satisfied}
                onChange={() => setFormData({ ...formData, satisfied: false })}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comments (if any)
          </label>
          <textarea
            value={formData.additionalComments}
            onChange={(e) =>
              setFormData({ ...formData, additionalComments: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your thoughts about the session..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}