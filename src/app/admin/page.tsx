'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/Admin/Sidebar';
import CourseForm from '@/components/Admin/CourseForm';
import ActiveCourses from '@/components/Admin/ActiveCourses';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeSection, setActiveSection] = useState('courses');
  const [showActiveCourses, setShowActiveCourses] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual admin authentication
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      setIsAuthenticated(true);
    }
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={() => setIsAuthenticated(false)}
      />
      <div className="md:pl-64">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 