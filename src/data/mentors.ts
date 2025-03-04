import { Mentor, DayOfWeek } from '@/types/mentor';
import { Region, Gender, OptionalSubject } from '@/types/mentee';

export const sampleMentors: Mentor[] = [
  {
    name: "Amit Sharma",
    email: "amit.sharma@example.com",
    phone: "+91-9876543210",
    region: Region.NORTH,
    gender: Gender.MALE,
    optionalSubject: OptionalSubject.HISTORY,
    givenInterview: true,
    numberOfAttemptsInUpsc: 3,
    numberOfMainsAttempts: 2,
    offDaysOfWeek: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY]
  },
  {
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91-9876543211",
    region: Region.SOUTH,
    gender: Gender.FEMALE,
    optionalSubject: OptionalSubject.ECONOMICS,
    givenInterview: false,
    numberOfAttemptsInUpsc: 2,
    numberOfMainsAttempts: 1,
    offDaysOfWeek: [DayOfWeek.FRIDAY, DayOfWeek.SATURDAY]
  },
  {
    name: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    phone: "+91-9876543212",
    region: Region.EAST,
    gender: Gender.MALE,
    optionalSubject: OptionalSubject.POLITICAL_SCIENCE_AND_INTERNATIONAL_RELATIONS,
    givenInterview: true,
    numberOfAttemptsInUpsc: 4,
    numberOfMainsAttempts: 3,
    offDaysOfWeek: [DayOfWeek.MONDAY, DayOfWeek.THURSDAY]
  },
  {
    name: "Anjali Singh",
    email: "anjali.singh@example.com",
    phone: "+91-9876543213",
    region: Region.WEST,
    gender: Gender.FEMALE,
    optionalSubject: OptionalSubject.PUBLIC_ADMINISTRATION,
    givenInterview: false,
    numberOfAttemptsInUpsc: 1,
    numberOfMainsAttempts: 0,
    offDaysOfWeek: [DayOfWeek.WEDNESDAY, DayOfWeek.SATURDAY]
  },
  {
    name: "Manish Gupta",
    email: "manish.gupta@example.com",
    phone: "+91-9876543214",
    region: Region.NORTH,
    gender: Gender.MALE,
    optionalSubject: OptionalSubject.GEOGRAPHY,
    givenInterview: true,
    numberOfAttemptsInUpsc: 5,
    numberOfMainsAttempts: 4,
    offDaysOfWeek: [DayOfWeek.TUESDAY, DayOfWeek.FRIDAY]
  }
]; 