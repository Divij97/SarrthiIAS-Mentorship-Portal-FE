import { AddDocumentsRequest, AdminData, BulkMentorshipGroupCreateOrUpdateRequest, CreateMenteeRequest, CreateMentorRequest, DeleteGroupSessionsRequest, MentorAssignmentRequest, MentorFeedbackResponse, MentorshipSessionsResponse, OngoingSessions, PasswordResetRequest, ResetPasswordResponse, ResourceType, UpdateMenteeCourseRequest } from '@/types/admin';
import { config } from '@/config/env';
import { MenteesResponse } from '@/types/admin';
import { MenteesForCsvExport, MenteeWithAuth, StrippedDownMentee } from '@/types/mentee';
import { fetchSafe } from '@/utils/api';
import { SHA256 } from 'crypto-js';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';

export const loginAdmin = async (authHeader: string): Promise<AdminData> => {
  return await fetchSafe<AdminData>(`${config.api.url}/v1/admin/me`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin'
    });
};

export const assignMenteesToCourseGroups = async (courseId: string, authHeader: string): Promise<void> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/courses/${courseId}/assignGroups`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to assign groups to course');
    }
  } catch (error) {
    console.error('Error assigning groups to course:', error);
    throw error;
  }
};

export const registerMentee = async (mentee: CreateMenteeRequest, authHeader: string): Promise<boolean> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const response = await fetch(`${config.api.url}/v1/mentees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${authHeader}`,
      },
      body: JSON.stringify(mentee),
    });

    if (!response) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error registering mentee:', error);
    return false;
  }
}

export const registerMentor = async (mentor: CreateMentorRequest, authHeader: string): Promise<boolean> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${config.api.url}/v1/mentors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${authHeader}`,
      },
      body: JSON.stringify(mentor),
    });

    if (!response) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error registering mentor:', error);
    return false;
  }
}

export const createOrUpdateGroupSession = async (courseId: string, groupId: string, request: BulkMentorshipGroupCreateOrUpdateRequest, authHeader: string): Promise<MentorshipSessionsResponse> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/courses/${courseId}/groups/${groupId}`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to create group session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating group session:', error);
    throw error;
  }
}

export const deleteGroupSessions = async (groupId: string, request: DeleteGroupSessionsRequest, authHeader: string): Promise<void> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/courses/groups/${groupId}/sessions`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to delete group session');
    }
  } catch (error) {
    console.error('Error deleting group session:', error);
    throw error;
  }
}


export interface MenteesFilters {
  courseId?: string;
  groupId?: string;
  limit: number;
  skip?: number;
  searchQuery?: string;
  unassigned?: boolean;
}

export const fetchMentees = async (filters: MenteesFilters, authHeader: string): Promise<MenteesResponse> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (filters.courseId) queryParams.append('courseId', filters.courseId);
    if (filters.groupId) queryParams.append('groupId', filters.groupId);
    queryParams.append('limit', filters.limit.toString());
    if (filters.skip !== undefined) queryParams.append('skip', filters.skip.toString());
    if (filters.unassigned) queryParams.append('unassigned', filters.unassigned.toString());
    const response = await fetch(`${apiUrl}/v1/admin/mentees?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mentees');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching mentees:', error);
    throw error;
  }
};

export const updateMenteesEnrolledInCourse = async (courseId: string, requestBody: UpdateMenteeCourseRequest, authHeader: string): Promise<void> => {
  const response = await fetch(`${config.api.url}/v1/admin/courses/${courseId}/mentees`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to register mentees');
  }
}

export const updateMenteeEnrolledInGroup = async (courseId: string, groupId: string, requestBody: UpdateMenteeCourseRequest, authHeader: string): Promise<void> => {
  try {
    await fetch(`${config.api.url}/v1/admin/course/${courseId}/groups/${groupId}/mentees`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  } catch (error) {
    console.error(`Failed to update mentee information.`)
  }
}

export const addDocumentsToCourse = async (courseId: string, requestBody: AddDocumentsRequest, authHeader: string): Promise<void> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/courses/${courseId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to add documents to course');
    }
  } catch (error) {
    console.error('Error adding documents to course:', error);
    throw error;
  }
}

export const deleteResource = async (resourceType: ResourceType, resourceId: string, authHeader: string): Promise<void> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/${resourceType}/${resourceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete resource');
    }
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
}

export const fetchCourseAllMentees = async (courseId: string, authHeader: string): Promise<MenteesForCsvExport[]> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // Fetch all mentees for a course with a high limit to get everything
    const queryParams = new URLSearchParams();
    queryParams.append('courseId', courseId);
    queryParams.append('limit', '1200'); // Use a high limit to get all mentees

    const response = await fetch(`${apiUrl}/v1/admin/mentees?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course mentees');
    }

    const data: MenteesResponse = await response.json();
    return data.mentees;
  } catch (error) {
    console.error('Error fetching course mentees:', error);
    throw error;
  }
};

export const assignMentorToMentee = async (menteeUserName: string, request: MentorAssignmentRequest, authHeader: string): Promise<void> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/admin/${menteeUserName}/assignMentor`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Error assigning mentor to mentee');
    }
  } catch (error) {
    console.error('Error assigning mentor to mentee:', error);
    throw error;
  }
}

export const resetPasswordForUser = async (username: string, request: PasswordResetRequest, authHeader: string): Promise<void> => {
  return await fetchSafe<void>(`${config.api.url}/v1/internal/users/${username}/resetPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(request)
  });
}

export const resetPasswordByAdmin = async (username: string, newPassword: string, authHeader: string): Promise<void> => {
  const resetPasswordRequest = {
    username: username,
    passwordSHA: SHA256(newPassword).toString()
  }
  return await fetchSafe<void>(`${config.api.url}/v1/mentees?assignMentor=false`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(resetPasswordRequest)
  });
}
export const fullMenteesList = async (authHeader: string): Promise<MenteesResponse> => {
  const BATCH_SIZE = 300;
  let allMentees: MenteesForCsvExport[] = [];
  let currentSkip = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await fetchMentees(
        {
          limit: BATCH_SIZE,
          skip: currentSkip,
        },
        authHeader
      );

      allMentees = [...allMentees, ...response.mentees];

      // If we get fewer mentees than the batch size, we've reached the end
      if (response.mentees.length < BATCH_SIZE) {
        hasMore = false;
      } else {
        currentSkip += BATCH_SIZE;
      }
    }

    return {
      mentees: allMentees,
    };
  } catch (error) {
    console.error('Error fetching all mentees:', error);
    throw error;
  }
}

export const getMentorFeedback = async (mentorUsername: string, authHeader: string): Promise<MentorFeedbackResponse> => {
  return await fetchSafe<MentorFeedbackResponse>(`${config.api.url}/v1/feedback?mentorUsername=${mentorUsername}`, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    }
  });
}

export const getAllMentorsFeedback = async (authHeader: string): Promise<MentorFeedbackResponse> => {
  try {
    // Get all mentors from the admin store
    const adminData = useAdminAuthStore.getState().adminData;
    if (!adminData?.mentors) {
      throw new Error('No mentors found');
    }

    // Collect feedbacks from all mentors
    const allFeedbacks = await Promise.all(
      adminData.mentors.map(async (mentor) => {
        try {
          const response = await getMentorFeedback(mentor.phone, authHeader);
          return response.feedbacksSortedByDate;
        } catch (error) {
          console.error(`Error fetching feedback for mentor ${mentor.phone}:`, error);
          return []; // Return empty array for failed requests
        }
      })
    );

    // Flatten the array of feedbacks
    const flattenedFeedbacks = allFeedbacks.flat();

    return {
      feedbacksSortedByDate: flattenedFeedbacks
    };
  } catch (error) {
    console.error('Error fetching all mentors feedback:', error);
    throw error;
  }
}

export const editMenteeDetails = async (mentee: StrippedDownMentee, authHeader: string): Promise<void> => {
  return await fetchSafe<void>(`${config.api.url}/v1/internal/mentees/${mentee.p}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(mentee)
  })
}

export const getOngoingSessions = async (authHeader: string): Promise<OngoingSessions> => {
  return await fetchSafe<OngoingSessions>(`${config.api.url}/v1/admin/mentorship-sessions`, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    }
  });
}

export const updateMenteeWithNewPassword = async (username: string, request: PasswordResetRequest, authHeader: string): Promise<ResetPasswordResponse> => {
  return await fetchSafe<ResetPasswordResponse>(`${config.api.url}/v1/admin/users/${username}/resetPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(request)
  });
}