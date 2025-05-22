'use client';

import { useEffect, useState, useMemo } from 'react';
import { getOngoingSessions } from '@/services/admin';
import { MentorshipSession } from '@/types/session';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

// Extend MentorshipSession to include the sessionDate property
interface SessionWithDate extends MentorshipSession {
  sessionDate: string;
}

export default function OngoingSessionsPage() {
  const [sessions, setSessions] = useState<SessionWithDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState<string>('all');
  const sessionsPerPage = 10;
  const authHeader = useAdminAuthStore((state) => state._authHeader);

  // Get unique mentors from sessions and format them for the Select component
  const mentorOptions = useMemo(() => {
    const uniqueMentors = new Set(sessions.map(session => session.m));
    return [
      { value: 'all', label: 'All Mentors' },
      ...Array.from(uniqueMentors)
        .sort()
        .map(mentor => ({ value: mentor, label: mentor }))
    ];
  }, [sessions]);

  // Filter sessions based on selected mentor
  const filteredSessions = useMemo(() => {
    if (selectedMentor === 'all') {
      return sessions;
    }
    return sessions.filter(session => session.m === selectedMentor);
  }, [sessions, selectedMentor]);

  // Calculate pagination values using filtered sessions
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const endIndex = startIndex + sessionsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMentor]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getOngoingSessions(authHeader);
        console.log('Response dates:', Object.keys(response.sessionsByDate));
        // Flatten all sessions from all dates into a single array
        const allSessions = Object.entries(response.sessionsByDate).flatMap(([date, sessions]) => {
          console.log('Processing date:', date, 'sessions:', sessions);
          // Log the first session's time format if available
          if (sessions.length > 0) {
            console.log('Time format example:', {
              startTime: sessions[0].st,
              endTime: sessions[0].et
            });
          }
          return sessions.map(session => ({
            ...session,
            sessionDate: date
          }));
        });
        // Sort sessions by date and time
        const sortedSessions = allSessions.sort((a, b) => {
          // Convert dd/MM/yyyy to yyyy-MM-dd for proper date comparison
          const [dayA, monthA, yearA] = a.sessionDate.split('/');
          const [dayB, monthB, yearB] = b.sessionDate.split('/');
          
          const dateA = `${yearA}-${monthA}-${dayA}`;
          const dateB = `${yearB}-${monthB}-${dayB}`;
          
          // First compare by date
          const dateComparison = dateA.localeCompare(dateB);
          if (dateComparison !== 0) {
            return dateComparison;
          }
          
          // If dates are equal, compare by start time
          return a.st.localeCompare(b.st);
        });
        setSessions(sortedSessions);
      } catch (err) {
        setError('Failed to fetch ongoing sessions');
        console.error('Error fetching ongoing sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authHeader) {
      fetchSessions();
    }
  }, [authHeader]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>All Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <CardTitle>All Sessions</CardTitle>
            <div className="min-w-[250px] max-w-[300px] flex-1">
              <Select
                value={selectedMentor}
                onChange={(value) => setSelectedMentor(value)}
                options={mentorOptions}
                label="Filter by mentor"
                className="pr-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-center text-gray-500">No sessions found</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Mentee</TableHead>
                    <TableHead>Session Link</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        {session.sessionDate}
                      </TableCell>
                      <TableCell>{session.m}</TableCell>
                      <TableCell>{session.mn} ({session.mu})</TableCell>
                      <TableCell> 
                        {session.z ? (
                          <a
                            href={session.z}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Join Session
                          </a>
                        ) : (
                          <span className="text-gray-500">No link available</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {session.st} - {session.et}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredSessions.length)} of {filteredSessions.length} sessions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 