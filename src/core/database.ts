// LocalStorage and IndexedDB management for face data and sessions

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email?: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  timestamp: number;
  confidence: number;
  status: 'present' | 'absent' | 'late';
}

export interface Session {
  id: string;
  className: string;
  date: string;
  startTime: number;
  endTime?: number;
  subject?: string;
  createdBy?: string;
}

const STORAGE_KEY_FACES = 'face_descriptors';
const STORAGE_KEY_STUDENTS = 'students';
const STORAGE_KEY_SESSIONS = 'sessions';
const STORAGE_KEY_ATTENDANCE = 'attendance';

export class AttendanceDB {
  // Students
  static saveStudent(student: Student): void {
    const students = this.getAllStudents();
    const idx = students.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      students[idx] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }

  static getStudent(id: string): Student | null {
    const students = this.getAllStudents();
    return students.find(s => s.id === id) || null;
  }

  static getAllStudents(): Student[] {
    const data = localStorage.getItem(STORAGE_KEY_STUDENTS);
    return data ? JSON.parse(data) : [];
  }

  static deleteStudent(id: string): void {
    const students = this.getAllStudents().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }

  // Sessions
  static saveSession(session: Session): void {
    const sessions = this.getAllSessions();
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }

  static getSession(id: string): Session | null {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === id) || null;
  }

  static getAllSessions(): Session[] {
    const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
    return data ? JSON.parse(data) : [];
  }

  static deleteSession(id: string): void {
    const sessions = this.getAllSessions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }

  // Attendance Records
  static saveAttendance(record: AttendanceRecord): void {
    const records = this.getAllAttendance();
    records.push(record);
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(records));
  }

  static getSessionAttendance(sessionId: string): AttendanceRecord[] {
    return this.getAllAttendance().filter(r => r.sessionId === sessionId);
  }

  static getAllAttendance(): AttendanceRecord[] {
    const data = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
    return data ? JSON.parse(data) : [];
  }

  static deleteAttendance(id: string): void {
    const records = this.getAllAttendance().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(records));
  }

  // Face Data
  static saveFaceData(data: string): void {
    localStorage.setItem(STORAGE_KEY_FACES, data);
  }

  static getFaceData(): string | null {
    return localStorage.getItem(STORAGE_KEY_FACES);
  }

  // Utility
  static exportAllData() {
    return {
      students: this.getAllStudents(),
      sessions: this.getAllSessions(),
      attendance: this.getAllAttendance(),
      faces: this.getFaceData(),
    };
  }

  static importAllData(data: any): void {
    if (data.students) localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(data.students));
    if (data.sessions) localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(data.sessions));
    if (data.attendance) localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(data.attendance));
    if (data.faces) localStorage.setItem(STORAGE_KEY_FACES, data.faces);
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY_FACES);
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    localStorage.removeItem(STORAGE_KEY_ATTENDANCE);
  }
}
