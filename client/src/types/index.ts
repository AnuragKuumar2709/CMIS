// User and Authentication Types
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'STUDENT';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'ADMIN' | 'STAFF' | 'STUDENT';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Student Types
export interface Student {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  batch: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  course?: Course;
}

export interface CreateStudentData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  batch: string;
  courseId: string;
}

// Course Types
export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department?: Department;
  students?: Student[];
}

export interface CreateCourseData {
  name: string;
  code: string;
  credits: number;
  departmentId: string;
}

// Department Types
export interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  courses?: Course[];
}

export interface CreateDepartmentData {
  name: string;
  code: string;
}

// Subject Types
export interface Subject {
  id: string;
  name: string;
  code: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  course?: Course;
}

export interface CreateSubjectData {
  name: string;
  code: string;
  courseId: string;
}

// Fee Types
export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  description: string;
  dueDate: string;
  feeType: 'TUITION' | 'EXAM' | 'LIBRARY' | 'OTHER';
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE';
  paidAmount?: number;
  paidDate?: string;
  createdAt: string;
  student?: Student;
}

export interface CreateFeeData {
  studentId: string;
  amount: number;
  description: string;
  dueDate: string;
  feeType: 'TUITION' | 'EXAM' | 'LIBRARY' | 'OTHER';
}

// Exam Types
export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  date: string;
  totalMarks: number;
  duration: number;
  createdAt: string;
  subject?: Subject;
}

export interface CreateExamData {
  name: string;
  subjectId: string;
  date: string;
  totalMarks: number;
  duration: number;
}

// Grade Types
export interface Grade {
  id: string;
  studentId: string;
  examId: string;
  marks: number;
  remarks?: string;
  createdAt: string;
  student?: Student;
  exam?: Exam;
}

export interface CreateGradeData {
  studentId: string;
  marks: number;
  remarks?: string;
}

// Attendance Types
export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  present: boolean;
  createdAt: string;
  student?: Student;
  subject?: Subject;
}

export interface CreateAttendanceData {
  studentId: string;
  subjectId: string;
  date: string;
  present: boolean;
}

// Timetable Types
export interface Timetable {
  id: string;
  courseId: string;
  subjectId: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  createdAt: string;
  course?: Course;
  subject?: Subject;
}

export interface CreateTimetableData {
  courseId: string;
  subjectId: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalFees: number;
  totalExams: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'STUDENT_ADDED' | 'FEE_PAID' | 'EXAM_CREATED' | 'ATTENDANCE_MARKED';
  description: string;
  timestamp: string;
  userId: string;
  user?: User;
}
