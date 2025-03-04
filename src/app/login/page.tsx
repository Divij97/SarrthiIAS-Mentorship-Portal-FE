'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { UserType } from '@/types/auth';
import { RadioGroup } from '@/components/ui/RadioGroup';

const userTypeOptions = [
  { value: UserType.MENTOR, label: 'Mentor' },
  { value: UserType.MENTEE, label: 'Mentee' }
];

export default function LoginPage() {
  const router = useRouter();
  const { 
    phone, 
    password, 
    error, 
    loading, 
    isAuthenticated,
    setPhone, 
    setPassword, 
    setError,
    setUserType,
    handleLogin 
  } = useLoginStore();
  const { setMentee, mentee } = useMenteeStore();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (mentee) {
        router.push('/home');
      } else {
        router.push('/signup');
      }
    }
  }, [isAuthenticated, mentee, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mentee = await handleLogin();
      if (mentee) {
        setMentee(mentee);
        router.push('/home');
      } else if (isAuthenticated) {
        router.push('/signup');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Saarthi IAS Mentorship Portal
          </h1>
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="is-mentor"
                  name="is-mentor"
                  type="checkbox"
                  onChange={(e) => setUserType(e.target.checked ? UserType.MENTOR : UserType.MENTEE)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is-mentor" className="ml-2 block text-sm text-gray-900">
                  I am a mentor
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
            </div>

            <div className="text-sm text-right">
              <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                Forgot your password?
              </a>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                disabled={loading}
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