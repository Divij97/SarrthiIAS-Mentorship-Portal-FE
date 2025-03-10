export interface Course {
  name: string;
  description: string;
  isOneOnOneMentorshipCourse: boolean;
  endDate: string;
}

export interface CourseGroup {
  id: string;
  name: string;
  menteeCount: number;
  mentorAssigned: boolean;
}

// Sample course data for development
export const sampleCourses: Course[] = [
  {
    name: 'UPSC Foundation Course 2024',
    description: 'Comprehensive foundation course covering all UPSC CSE Prelims and Mains subjects with integrated answer writing practice.',
    isOneOnOneMentorshipCourse: false,
    endDate: '2024-12-31'
  },
  {
    name: 'Advanced Essay Writing Program',
    description: 'Specialized program focusing on essay paper preparation with detailed feedback and personalized mentoring.',
    isOneOnOneMentorshipCourse: true,
    endDate: '2024-06-30'
  },
  {
    name: 'Current Affairs Mastery',
    description: 'Daily current affairs analysis and weekly tests covering all relevant topics for UPSC preparation.',
    isOneOnOneMentorshipCourse: false,
    endDate: '2024-09-30'
  },
  {
    name: 'Optional Subject: Sociology',
    description: 'In-depth coverage of Sociology optional subject with focus on previous year questions and answer writing.',
    isOneOnOneMentorshipCourse: true,
    endDate: '2024-08-31'
  },
  {
    name: 'Interview Preparation Program',
    description: 'Comprehensive personality test preparation program with mock interviews and detailed feedback.',
    isOneOnOneMentorshipCourse: true,
    endDate: '2024-10-31'
  }
];

// Sample group data for development
export const sampleCourseGroups: { [courseName: string]: CourseGroup[] } = {
  'UPSC Foundation Course 2024': [
    {
      id: 'group-1',
      name: 'Group-1',
      menteeCount: 15,
      mentorAssigned: true
    },
    {
      id: 'group-2',
      name: 'Group-2',
      menteeCount: 12,
      mentorAssigned: false
    },
    {
      id: 'group-3',
      name: 'Group-3',
      menteeCount: 18,
      mentorAssigned: true
    }
  ],
  'Advanced Essay Writing Program': [
    {
      id: 'group-1',
      name: 'Group-1',
      menteeCount: 8,
      mentorAssigned: true
    },
    {
      id: 'group-2',
      name: 'Group-2',
      menteeCount: 10,
      mentorAssigned: true
    }
  ]
};

// Remove sample courses as we'll be getting real data from the backend 