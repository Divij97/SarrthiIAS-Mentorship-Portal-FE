export enum UserType {
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
  ADMIN = 'ADMIN'
}

export interface TempMenteeData {
  phone: string;
  password: string;
  verifiedOtp: string;
} 

export interface TempMentorData {
  phone: string;
  password: string;
  verifiedOtp: string;
} 