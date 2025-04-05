'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Base64 } from 'js-base64';
import { SHA256 } from 'crypto-js';
import { useSearchParams } from 'next/navigation';

import { useLoginStore } from '@/stores/auth/store';
import { UserType } from '@/types/auth';
import { useMentorStore } from '@/stores/mentor/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { getMentorByPhone } from '@/services/mentors';
import { resetUserPassword } from '@/services/login';
import { config } from '@/config/env';

export default function UpdatePasswordPage() {
    const searchParams = useSearchParams();
    const phone = searchParams.get('phone');
    const { userType } = useLoginStore();
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const resetPassword = async () => {
            if (!phone) {
                setError('Phone number is required');
                return;
            }
            const authHeader = Base64.encode(`${phone}:${SHA256(config.auth.defaultPassword).toString()}`);
            try {
                const resetPasswordResponse = await resetUserPassword(authHeader, phone);
                console.log(resetPasswordResponse);
            } catch (error) {
                setError('Failed to reset password. Please try again.');
                console.error('Failed to reset password:', error);
            }
        };

        resetPassword();
    }, [userType, phone, setError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        //todo: update password
        try {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
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
          <p className="mt-2 text-center text-sm text-gray-600">
            Verify with OTP and Set a new password 
          </p>
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
                {loading ? 'Processing...': 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}