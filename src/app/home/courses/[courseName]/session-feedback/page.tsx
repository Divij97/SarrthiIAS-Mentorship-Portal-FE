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
  examKnowledge: number;
  politeness: 'Polite' | 'Not';
  delayed: boolean;
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
    satisfied: true,
    examKnowledge: 5,
    politeness: 'Polite',
    delayed: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    if (formData.rating === 0) {
      toast.error('Please rate your experience');
      return;
    }

    if (formData.examKnowledge === 0) {
      toast.error('Please rate mentor\'s knowledge of exam pattern');
      return;
    }

    if (!formData.politeness) {
      toast.error('Please select mentor\'s politeness');
      return;
    }

    if (formData.delayed === undefined) {
      toast.error('Please select punctuality status');
      return;
    }

    if (formData.satisfied === undefined) {
      toast.error('Please indicate if you were satisfied with the session');
      return;
    }

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
                examKnowledge: formData.examKnowledge,
                politeness: formData.politeness,
                delayed: formData.delayed,
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
            Rate your experience <span className="text-red-500">*</span>
          </label>
          <StarRating
            value={formData.rating}
            onChange={(rating) => setFormData({ ...formData, rating })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mentor's Knowledge of Exam Pattern <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.examKnowledge}
            onChange={(e) => setFormData({ ...formData, examKnowledge: Number(e.target.value) })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Very Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mentor's Politeness <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4" role="radiogroup" aria-required="true">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="politeness"
                checked={formData.politeness === 'Polite'}
                onChange={() => setFormData({ ...formData, politeness: 'Polite' })}
                required
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Polite</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="politeness"
                checked={formData.politeness === 'Not'}
                onChange={() => setFormData({ ...formData, politeness: 'Not' })}
                required
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Not Polite</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Punctuality <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4" role="radiogroup" aria-required="true">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="punctuality"
                checked={!formData.delayed}
                onChange={() => setFormData({ ...formData, delayed: false })}
                required
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Session started on time</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="punctuality"
                checked={formData.delayed}
                onChange={() => setFormData({ ...formData, delayed: true })}
                required
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Delayed</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Were you satisfied with the session experience? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4" role="radiogroup" aria-required="true">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="satisfaction"
                checked={formData.satisfied}
                onChange={() => setFormData({ ...formData, satisfied: true })}
                required
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="satisfaction"
                checked={!formData.satisfied}
                onChange={() => setFormData({ ...formData, satisfied: false })}
                required
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comments (optional)
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