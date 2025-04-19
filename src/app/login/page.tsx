'use client';

import { useState, useRef, useEffect } from 'react';
import { config } from '@/config/env';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { useMentorStore } from '@/stores/mentor/store';
import { UserType } from '@/types/auth';
import { MentorResponse } from '@/types/mentor';
import { MenteeResponse } from '@/types/mentee';
import { forgotPassword } from '@/services/mentee';

export default function LoginPage() {
  const router = useRouter();
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const formSubmittedRef = useRef(false);
  const loginInProgressRef = useRef(false);
  const { 
    phone, 
    password, 
    error, 
    loading, 
    userType,
    setPhone, 
    setPassword, 
    setError,
    setUserType,
    handleLogin 
  } = useLoginStore();
  const { setMenteeResponse, setCourses } = useMenteeStore();
  const { setMentor, setMentorResponse } = useMentorStore();
  const { getAuthHeader, setAuthHeader } = useLoginStore();

  // Clear login state on component mount
  useEffect(() => {
    loginInProgressRef.current = false;
    formSubmittedRef.current = false;
    
    // Return cleanup function
    return () => {
      loginInProgressRef.current = false;
      formSubmittedRef.current = false;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple simultaneous form submissions
    if (formSubmittedRef.current || loading || loginInProgressRef.current) {
      console.log('Form submission or login already in progress, ignoring duplicate request');
      return;
    }
    
    try {
      formSubmittedRef.current = true;
      loginInProgressRef.current = true;
      
      const passwordToUse = isFirstTimeLogin ? config.auth.defaultPassword : password.trim();
      setPassword(passwordToUse);
      
      console.log('Submitting login form:', new Date().toISOString());
      const response = await handleLogin();
      
      if (response) {
        if (userType === UserType.MENTOR) {
          const mentorResponse = response as MentorResponse;
          setMentor(mentorResponse.m);
          setMentorResponse(mentorResponse);
          if (mentorResponse.o) {
            // Store OTP in login store and redirect to reset password
            router.push(`/reset-password?phone=${phone}`);
          } else {
            router.push('/home');
          }
        } else {
          const menteeResponse = response as MenteeResponse;
          
          // setMentee(menteeResponse.mentee);
          setMenteeResponse(menteeResponse);
          setCourses(menteeResponse.enrolledCourses);
          if (menteeResponse.otp) {
            console.log("Redirecting to reset password");
            router.push(`/reset-password?phone=${phone}`);
          } else {
            console.log("Redirecting to home");
            router.push('/home');
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      // Make sure we clear the flags even if there's an error
      formSubmittedRef.current = false;
      setTimeout(() => {
        // Use a timeout to ensure we don't immediately allow another submission
        loginInProgressRef.current = false;
      }, 500);
    }
  };

  const handleForgotPassword = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid phone number first');
      return;
    }
    try {
      await forgotPassword(phone, getAuthHeader());
      router.push(`/update-password?phone=${phone}`);
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto w-auto flex justify-center mb-6">
            <Image
              src="/sarrthiias.webp"
              alt="Sarrthi IAS Logo"
              width={200}
              height={60}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Sign in to your account
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your 10-digit phone number"
                  disabled={loading}
                />
              </div>
            </div>

            {!isFirstTimeLogin && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="is-mentor"
                  name="is-mentor"
                  type="checkbox"
                  checked={userType === UserType.MENTOR}
                  onChange={(e) => setUserType(e.target.checked ? UserType.MENTOR : UserType.MENTEE)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is-mentor" className="ml-2 block text-sm text-gray-900">
                  I am a mentor
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="first-time-login"
                  name="first-time-login"
                  type="checkbox"
                  checked={isFirstTimeLogin}
                  onChange={(e) => {
                    setIsFirstTimeLogin(e.target.checked);
                    if (e.target.checked) {
                      setPassword('');
                    }
                  }}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="first-time-login" className="ml-2 block text-sm text-gray-900">
                  Logging in for the first time
                </label>
              </div>
            </div>

            <div className="text-sm text-right">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-orange-600 hover:text-orange-500"
                disabled={isFirstTimeLogin}
              >
                Forgot your password?
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                disabled={loading || formSubmittedRef.current || loginInProgressRef.current}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 