'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMentorStore } from '@/stores/mentor/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { UserType } from '@/types/auth';
import { updateMentorPassword } from '@/services/mentors';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const { error, setError, userType, authHeader } = useLoginStore();
  const { mentor, mentorResponse } = useMentorStore();
  const { menteeResponse } = useMenteeStore();
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const validateInputs = () => {
    if (!phone) {
      setError('Phone number not found');
      return false;
    }

    const expectedOtp = userType === UserType.MENTOR ? mentorResponse?.otp : menteeResponse?.otp;
    
    if (!expectedOtp) {
      setError('OTP not found. Please try logging in again.');
      return false;
    }

    if (otp !== expectedOtp) {
      setError('Invalid OTP. Please check and try again.');
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

  const handleMentorPasswordReset = async () => {
    if (!authHeader) {
      setError('Authentication error. Please try logging in again.');
      return;
    }

    if (!mentor?.phone) {
      setError('Phone number not found');
      return;
    }

    try {
      const response = await updateMentorPassword({
        phone: mentor.phone,
        newPassword,
        otp,
        authHeader
      });
      
      // If we get here, the request was successful, even if no response body
      router.replace('/home');
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error instanceof Error ? error.message : 'Failed to update password. Please try again.');
      throw error; // Re-throw to be caught by the handleSubmit function
    }
  };

  const handleMenteeSignup = () => {
    // Store necessary information for signup
    localStorage.setItem('tempMenteeData', JSON.stringify({
      phone,
      password: newPassword,
      verifiedOtp: otp
    }));
    router.replace('/signup');
  };

  const handleMentorSignup = () => {
    // Store necessary information for signup
    localStorage.setItem('tempMentorData', JSON.stringify({
      phone,
      password: newPassword,
      verifiedOtp: otp
    }));
    router.replace('/mentor-signup');
  };

  const handleResendOtp = async () => {
    if (!phone) {
      setError('Phone number not found');
      return;
    }

    try {
      setResending(true);
      setError('');

      // In a real implementation, you would call your API here
      // Example of handling a PUT request that doesn't return a response
      const response = await fetch(`/api/resend-otp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {})
        },
        body: JSON.stringify({ phone })
      });
      
      // Check if response is ok (status in the range 200-299)
      if (!response.ok) {
        // If we get an error response, try to parse it
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to resend OTP');
        } catch (parseError) {
          // If we can't parse the error, use the status text
          throw new Error(`Failed to resend OTP: ${response.statusText}`);
        }
      }
      
      // No need to parse response.json() if backend doesn't send a response
      // Just check if status is OK (204 No Content is common for successful PUT with no response)
      
      // Reset countdown and disable resend button
      setCountdown(60);
      setCanResend(false);
      
      // Show success message
      alert('OTP has been resent to your phone number');
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      setError(error instanceof Error ? error.message : 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (userType === UserType.MENTOR) {
        await handleMentorSignup();
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
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {userType === UserType.MENTOR ? 'Reset your password' : 'Create your account'}
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  placeholder="Enter OTP"
                />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {!canResend && countdown > 0 ? `Resend OTP in ${countdown}s` : ''}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || resending}
                  className={`text-sm font-medium ${
                    canResend && !resending
                      ? 'text-orange-600 hover:text-orange-500'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {resending ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                {userType === UserType.MENTOR ? 'New Password' : 'Create Password'}
              </label>
              <div className="mt-1">
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  placeholder={userType === UserType.MENTOR ? 'Enter new password' : 'Create a strong password'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
              >
                {loading ? 'Processing...' : userType === UserType.MENTOR ? 'Reset Password' : 'Continue to Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 