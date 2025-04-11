'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { RegisterMenteeModal } from '@/components/app/admin/mentees/register-mentee-modal';
import MenteesList from '@/components/Admin/mentees/MenteesList';
import { fetchMentees, MenteesFilters } from '@/services/admin';
import { toast } from 'react-hot-toast';
import { MenteesForCsvExport } from '@/types/mentee';

export default function MenteesPage() {
  const { adminData, getCourseGroups, getAuthHeader, refreshAdmin } = useAdminAuthStore();
  const [mentees, setMentees] = useState<MenteesForCsvExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<MenteesFilters>({
    limit: 10,
    skip: 0
  });

  useEffect(() => {
    fetchMenteesData();
  }, [filters]); // Add filters as dependency

  useMemo(() => {
    refreshAdmin(); 
  }, [])

  const fetchMenteesData = async () => {
    try {
      setLoading(true);
      const response = await fetchMentees(filters, getAuthHeader());
      setMentees(response.mentees);
      // If we get fewer mentees than the limit, there are no more to fetch
      setHasMore(response.mentees.length === filters.limit);
    } catch (error) {
      toast.error('Error fetching mentees:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!adminData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Extract courses from adminData
  const courses = adminData.courses?.map(course => ({
    id: course.id,
    name: course.name
  })) || [];

  // Get all groups from all courses
  const groups = courses.flatMap(course => {
    const courseGroups = getCourseGroups(course.id) || [];
    return courseGroups.map(group => ({
      groupId: group.groupId,
      groupFriendlyName: group.groupFriendlyName,
      course: course.id
    }));
  });

  const handleRefresh = async () => {
    // Reset to first page on refresh
    setFilters(prev => ({ ...prev, skip: 0 }));
  };

  const handleFilterChange = (key: keyof MenteesFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      skip: 0 // Reset skip to 0 when filters change
    }));
  };

  const handleNextPage = () => {
    setFilters(prev => ({
      ...prev,
      skip: prev.skip + prev.limit
    }));
  };

  const handlePrevPage = () => {
    setFilters(prev => ({
      ...prev,
      skip: Math.max(0, prev.skip - prev.limit)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Mentees Management</h2>
        <RegisterMenteeModal onSuccess={handleRefresh}/>
      </div>
      
      <MenteesList 
        courses={courses} 
        groups={groups} 
        mentees={mentees}
        loading={loading}
        onRefresh={handleRefresh}
        filters={filters}
        onFilterChange={handleFilterChange}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        hasMore={hasMore}
        currentPage={Math.floor(filters.skip / filters.limit) + 1}
      />
    </div>
  );
} 