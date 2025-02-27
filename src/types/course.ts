interface MentorshipGroup {
  id: string;
  // Add other group properties as needed
}

export interface Course {
  id: string;
  name: string;
  description: string;
  groups: MentorshipGroup[];
}

// Sample course data for development
export const sampleCourses: Course[] = [
  {
    id: 'course-1',
    name: 'UPSC Foundation Course 2024',
    description: 'Comprehensive foundation course covering all UPSC CSE Prelims and Mains subjects with integrated answer writing practice.',
    groups: []
  },
  {
    id: 'course-2',
    name: 'Advanced Essay Writing Program',
    description: 'Specialized program focusing on essay paper preparation with detailed feedback and personalized mentoring.',
    groups: []
  },
  {
    id: 'course-3',
    name: 'Current Affairs Mastery',
    description: 'Daily current affairs analysis and weekly tests covering all relevant topics for UPSC preparation.',
    groups: []
  },
  {
    id: 'course-4',
    name: 'Optional Subject: Sociology',
    description: 'In-depth coverage of Sociology optional subject with focus on previous year questions and answer writing.',
    groups: []
  },
  {
    id: 'course-5',
    name: 'Interview Preparation Program',
    description: 'Comprehensive personality test preparation program with mock interviews and detailed feedback.',
    groups: []
  }
];

// Remove sample courses as we'll be getting real data from the backend 