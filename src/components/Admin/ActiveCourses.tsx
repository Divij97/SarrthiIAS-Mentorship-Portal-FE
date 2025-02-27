'use client';

export default function ActiveCourses() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Active Courses</h3>
      </div>
      
      <div className="text-center py-8 text-gray-500">
        No active courses found
      </div>
    </div>
  );
} 