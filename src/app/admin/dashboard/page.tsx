'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/Admin/Sidebar';
import CourseForm from '@/components/Admin/CourseForm';
import ActiveCourses from '@/components/Admin/ActiveCourses';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('courses');
  const [showActiveCourses, setShowActiveCourses] = useState(false);

  const handleLogout = () => {
    // TODO: Implement proper logout
    router.push('/admin');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'courses':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Courses Management</h2>
            {showActiveCourses ? (
              <div>
                <button
                  onClick={() => setShowActiveCourses(false)}
                  className="mb-6 text-orange-600 hover:text-orange-700 font-medium flex items-center"
                >
                  ← Back to Course Creation
                </button>
                <ActiveCourses />
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Create New Course</h3>
                <CourseForm onViewActiveCourses={() => setShowActiveCourses(true)} />
              </div>
            )}
          </div>
        );
      case 'mentors':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Mentors Management</h2>
            {/* Add mentors management content here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <div className="md:pl-64">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 