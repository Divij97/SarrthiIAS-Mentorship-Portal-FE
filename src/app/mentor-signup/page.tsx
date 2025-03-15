'use client';

import MentorSignUpForm from '@/components/MentorSignUp/MentorSignUpForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sarrthi IAS Mentorship Program
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to the Sarrthi IAS Mentorship Program. Please complete this form to help us understand
            your qualifications and background.
          </p>
        </div>
        
        <MentorSignUpForm />
      </div>
    </main>
  );
} 