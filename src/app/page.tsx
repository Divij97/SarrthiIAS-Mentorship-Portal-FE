'use client';
import MultiStepForm from '@/components/MultiStepForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Saarthi IAS Mentorship Program
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to the Saarthi IAS Mentorship Program. Please complete this form to help us understand
            your preparation journey and how we can best support you.
          </p>
        </div>
        
        <MultiStepForm />
      </div>
    </main>
  );
}
