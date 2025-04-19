'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMentorStore } from '@/stores/mentor/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { UserType } from '@/types/auth';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const { error, setError, userType, getAuthHeader, setHasVerifiedOTP } = useLoginStore();
  const { mentorResponse, clearMentorOTP } = useMentorStore();
  const { menteeResponse, clearMenteeOTP } = useMenteeStore();
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateInputs = () => {
    if (!phone) {
      setError('Phone number not found');
      return false;
    }

    const expectedOtp = userType === UserType.MENTOR ? mentorResponse?.o : menteeResponse?.otp;
    
    if (!expectedOtp) {
      setError('OTP not found. Please try logging in again.');
      return false;
    }

    if (otp !== expectedOtp) {
      setError('Incorrect OTP. Please check and try again.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleMenteeSignup = () => {
    clearMenteeOTP?.();
    setHasVerifiedOTP?.(true);

    const hasOneOnOneMentorship = menteeResponse?.enrolledCourses.some((enrolledCourse) => enrolledCourse.course.isOneOnOneMentorshipCourse) && !menteeResponse?.assignedMentor?.phone;
    
    localStorage.setItem('tempMenteeData', JSON.stringify({
      phone,
      password: newPassword,
      verifiedOtp: otp,
      hasOneOnOneMentorship: hasOneOnOneMentorship || false 
    }));
    
    router.push('/signup');
  };

  const handleMentorSignup = () => {
    setHasVerifiedOTP?.(true);
    
    localStorage.setItem('tempMentorData', JSON.stringify({
      phone,
      password: newPassword,
      verifiedOtp: otp
    }));
    
    router.push('/mentor-signup');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      setHasVerifiedOTP?.(true);
      
      if (userType === UserType.MENTOR) {
        clearMentorOTP?.();
      } else {
        clearMenteeOTP?.();
      }

      if (userType === UserType.MENTOR) {
        handleMentorSignup();
      } else {
        handleMenteeSignup();
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-auto flex justify-center mb-6">
          <Image
            src="/sarrthiias.webp"
            alt="Sarrthi IAS Logo"
            width={180}
            height={50}
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        {userType === UserType.MENTEE && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Set a password to continue with your registration
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP sent to {phone}
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? 'bg-orange-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                }`}
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 