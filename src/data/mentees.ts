import { Mentee, Region, Gender, ReservationCategory, OptionalSubject, PreferredSlot, AnswerWritingLevel } from '@/types/mentee';

export const sampleMentees: Mentee[] = [
  {
    n: "Rahul Kumar",
    e: "rahul.kumar@example.com",
    p: "9876543220",
    region: Region.NORTH,
    gender: Gender.MALE,
    
    category: ReservationCategory.GENERAL,
    optionalSubject: OptionalSubject.POLITICAL_SCIENCE_AND_INTERNATIONAL_RELATIONS,
    isWorkingProfessional: false,
    givenInterview: false,
    numberOfAttemptsInUpsc: 1,
    numberOfMainsAttempts: 0,
    
    preferredSlots: [PreferredSlot.MORNING, PreferredSlot.EVENING],
    answerWritingLevel: AnswerWritingLevel.BEGINNER,
    weakSubjects: ["Economics", "Geography"],
    strongSubjects: ["History", "Political Science"],
    
    previouslyEnrolledCourses: ["UPSC Foundation Course"],
    primarySourceOfCurrentAffairs: "The Hindu Newspaper",
    expectationFromMentorshipCourse: "Looking to improve answer writing skills and get structured guidance"
  },
  {
    n: "Priya Patel",
    e: "priya.patel@example.com",
    p: "9876543221",
    region: Region.WEST,
    gender: Gender.FEMALE,
    
    category: ReservationCategory.OBC,
    optionalSubject: OptionalSubject.SOCIOLOGY,
    isWorkingProfessional: true,
    givenInterview: true,
    numberOfAttemptsInUpsc: 2,
    numberOfMainsAttempts: 1,
    
    preferredSlots: [PreferredSlot.EVENING],
    answerWritingLevel: AnswerWritingLevel.INTERMEDIATE,
    weakSubjects: ["Mathematics", "Science"],
    strongSubjects: ["Sociology", "Ethics"],
    
    previouslyEnrolledCourses: ["Answer Writing Program", "Interview Guidance"],
    primarySourceOfCurrentAffairs: "PIB, PRS",
    expectationFromMentorshipCourse: "Need help with Mains answer writing and interview preparation"
  },
  {
    n: "Mohammed Ali",
    e: "mohammed.ali@example.com",
    p: "9876543222",
    region: Region.SOUTH,
    gender: Gender.MALE,
    
    category: ReservationCategory.GENERAL,
    optionalSubject: OptionalSubject.GEOGRAPHY,
    isWorkingProfessional: false,
    givenInterview: false,
    numberOfAttemptsInUpsc: 0,
    numberOfMainsAttempts: 0,
    
    preferredSlots: [PreferredSlot.MORNING],
    answerWritingLevel: AnswerWritingLevel.BEGINNER,
    weakSubjects: ["History", "Current Affairs"],
    strongSubjects: ["Geography", "Environment"],
    
    previouslyEnrolledCourses: [],
    primarySourceOfCurrentAffairs: "Vision IAS Monthly Magazine",
    expectationFromMentorshipCourse: "Complete guidance for first attempt preparation"
  },
  {
    n: "Anjali Verma",
    e: "anjali.verma@example.com",
    p: "9876543223",
    region: Region.CENTRAL,
    gender: Gender.FEMALE,
    
    category: ReservationCategory.SC,
    optionalSubject: OptionalSubject.PUBLIC_ADMINISTRATION,
    isWorkingProfessional: true,
    givenInterview: true,
    numberOfAttemptsInUpsc: 3,
    numberOfMainsAttempts: 2,
    
    preferredSlots: [PreferredSlot.AFTERNOON, PreferredSlot.EVENING],
    answerWritingLevel: AnswerWritingLevel.ADVANCED,
    weakSubjects: ["Economy", "Science & Technology"],
    strongSubjects: ["Public Administration", "Ethics"],
    
    previouslyEnrolledCourses: ["Mains Test Series", "Interview Preparation"],
    primarySourceOfCurrentAffairs: "Multiple Sources",
    expectationFromMentorshipCourse: "Focused preparation for Mains and personality test"
  },
  {
    n: "Rajesh Singh",
    e: "rajesh.singh@example.com",
    p: "9876543224",
    region: Region.EAST,
    gender: Gender.MALE,
    
    category: ReservationCategory.ST,
    optionalSubject: OptionalSubject.ANTHROPOLOGY,
    isWorkingProfessional: false,
    givenInterview: false,
    numberOfAttemptsInUpsc: 1,
    numberOfMainsAttempts: 0,
    
    preferredSlots: [PreferredSlot.MORNING, PreferredSlot.AFTERNOON],
    answerWritingLevel: AnswerWritingLevel.INTERMEDIATE,
    weakSubjects: ["International Relations", "Economics"],
    strongSubjects: ["Anthropology", "Indian Society"],
    
    previouslyEnrolledCourses: ["Prelims Test Series"],
    primarySourceOfCurrentAffairs: "Newspapers and Online Portals",
    expectationFromMentorshipCourse: "Guidance for optional subject and overall strategy"
  }
]; 