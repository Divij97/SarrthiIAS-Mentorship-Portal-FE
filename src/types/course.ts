export interface Course {
  name: string;
  description: string;
  isOneOnOneMentorshipCourse: boolean;
  endDate: string;
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

// Remove sample courses as we'll be getting real data from the backend 