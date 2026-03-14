import axios from 'axios';
import type { 
  User, 
  Student, 
  Course, 
  Department, 
  Subject, 
  Fee, 
  Exam, 
  Grade, 
  Attendance, 
  Timetable,
  LoginCredentials,
  RegisterData,
  CreateStudentData,
  CreateCourseData,
  CreateDepartmentData,
  CreateSubjectData,
  CreateFeeData,
  CreateExamData,
  CreateGradeData,
  CreateAttendanceData,
  CreateTimetableData,
  AuthResponse
} from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

class ApiService {
  private api: ReturnType<typeof axios.create>;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = apiService.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data as AuthResponse;
  }

  async register(data: RegisterData): Promise<User> {
    const response = await this.api.post('/auth/register', data);
    return response.data as User;
  }

  // Students
  async getStudents(): Promise<Student[]> {
    const response = await this.api.get('/students');
    return response.data as Student[];
  }

  async createStudent(data: CreateStudentData): Promise<Student> {
    const response = await this.api.post('/students', data);
    return response.data as Student;
  }

  async getStudent(id: string): Promise<Student> {
    const response = await this.api.get(`/students/${id}`);
    return response.data as Student;
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    const response = await this.api.get('/courses');
    return response.data as Course[];
  }

  async createCourse(data: CreateCourseData): Promise<Course> {
    const response = await this.api.post('/courses', data);
    return response.data as Course;
  }

  async getCourse(id: string): Promise<Course> {
    const response = await this.api.get(`/courses/${id}`);
    return response.data as Course;
  }

  // Departments
  async getDepartments(): Promise<Department[]> {
    const response = await this.api.get('/departments');
    return response.data as Department[];
  }

  async createDepartment(data: CreateDepartmentData): Promise<Department> {
    const response = await this.api.post('/departments', data);
    return response.data as Department;
  }

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    const response = await this.api.get('/subjects');
    return response.data as Subject[];
  }

  async createSubject(data: CreateSubjectData): Promise<Subject> {
    const response = await this.api.post('/subjects', data);
    return response.data as Subject;
  }

  // Fees
  async getFees(): Promise<Fee[]> {
    const response = await this.api.get('/fees');
    return response.data as Fee[];
  }

  async createFee(data: CreateFeeData): Promise<Fee> {
    const response = await this.api.post('/fees', data);
    return response.data as Fee;
  }

  async getStudentFeeSummary(studentId: string): Promise<any> {
    const response = await this.api.get(`/fees/student/${studentId}/summary`);
    return response.data;
  }

  // Exams
  async getExams(): Promise<Exam[]> {
    const response = await this.api.get('/exams');
    return response.data as Exam[];
  }

  async createExam(data: CreateExamData): Promise<Exam> {
    const response = await this.api.post('/exams', data);
    return response.data as Exam;
  }

  async getExamGrades(examId: string): Promise<Grade[]> {
    const response = await this.api.get(`/exams/${examId}/grades`);
    return response.data as Grade[];
  }

  async addGrade(examId: string, data: CreateGradeData): Promise<Grade> {
    const response = await this.api.post(`/exams/${examId}/grades`, data);
    return response.data as Grade;
  }

  // Attendance
  async getAttendance(): Promise<Attendance[]> {
    const response = await this.api.get('/attendance');
    return response.data as Attendance[];
  }

  async createAttendance(data: CreateAttendanceData): Promise<Attendance> {
    const response = await this.api.post('/attendance', data);
    return response.data as Attendance;
  }

  // Timetable
  async getTimetable(): Promise<Timetable[]> {
    const response = await this.api.get('/timetable');
    return response.data as Timetable[];
  }

  async createTimetable(data: CreateTimetableData): Promise<Timetable> {
    const response = await this.api.post('/timetable', data);
    return response.data as Timetable;
  }

  async getCourseTimetable(courseId: string): Promise<any> {
    const response = await this.api.get(`/timetable/course/${courseId}`);
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeAuthToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Create and export a single instance
export const apiService = new ApiService();
export default apiService;
