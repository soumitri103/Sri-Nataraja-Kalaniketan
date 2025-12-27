import React, { useState, useEffect, ReactNode } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import CameraCapture from './components/CameraCapture';
import EnrollmentForm from './components/EnrollmentForm';
import { faceEngine } from './core/faceEngine';
import StudentsListTab from './components/StudentsListTab';

type PageType = 'enrollment' | 'attendance' | 'students' | 'records' | 'test';

interface AttendanceRecord {
  studentId: string;
  timestamp: string;
  status: 'present' | 'absent';
  confidence?: number;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  faceLabelDescriptor: any;
}

interface AppState {
  currentPage: PageType;
  enrolledCount: number;
  attendanceRecords: AttendanceRecord[];
  students: Student[];
  initError: string | null;
  isInitializing: boolean;
}

function App(): JSX.Element {
  const [state, setState] = useState<AppState>({
    currentPage: 'enrollment',
    enrolledCount: 0,
    attendanceRecords: [],
    students: [],
    initError: null,
    isInitializing: true,
  });

  // Initialize Face Engine on Component Mount
  useEffect(() => {
    const initializeFaceEngine = async (): Promise<void> => {
      try {
        console.log('Initializing Face Engine (face-api.js)...');
        await faceEngine.initialize();
        console.log('✓ Face Engine initialized successfully');

        // Load enrollment data from localStorage
        const storedStudents = localStorage.getItem('enrolledStudents');
        if (storedStudents) {
          try {
            const parsedStudents: Student[] = JSON.parse(storedStudents);
            setState((prev) => ({
              ...prev,
              enrolledCount: parsedStudents.length,
              students: parsedStudents,
            }));
          } catch (error) {
            console.error('Error parsing stored students:', error);
          }
        }

        // Load attendance records from localStorage
        const storedRecords = localStorage.getItem('attendanceRecords');
        if (storedRecords) {
          try {
            const parsedRecords: AttendanceRecord[] = JSON.parse(storedRecords);
            setState((prev) => ({
              ...prev,
              attendanceRecords: parsedRecords,
            }));
          } catch (error) {
            console.error('Error parsing attendance records:', error);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to initialize Face Engine:', error);
        setState((prev) => ({
          ...prev,
          initError: `Initialization failed: ${errorMessage}`,
        }));
      } finally {
        setState((prev) => ({
          ...prev,
          isInitializing: false,
        }));
      }
    };

    initializeFaceEngine();
  }, []);

  // Update page handler
  const handlePageChange = (page: PageType): void => {
    setState((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // Update enrolled count handler
  const handleEnrollmentSuccess = (): void => {
    const storedStudents = localStorage.getItem('enrolledStudents');
    if (storedStudents) {
      try {
        const students: Student[] = JSON.parse(storedStudents);
        setState((prev) => ({
          ...prev,
          enrolledCount: students.length,
          students: students,
        }));
      } catch (error) {
        console.error('Error updating enrolled count:', error);
      }
    }
    handlePageChange('attendance');
  };

  // Render page content based on current page
  const renderPageContent = (): ReactNode => {
    switch (state.currentPage) {
      case 'enrollment':
        return <EnrollmentForm onSuccess={handleEnrollmentSuccess} />;
      case 'attendance':
        return <Dashboard enrolledCount={state.enrolledCount} attendanceLogs={state.attendanceRecords} />;
      case 'students':
        return <StudentsListTab students={state.students} />;
      case 'test':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Face Recognition Testing</h2>
            <p>Test your face recognition setup here</p>
            <CameraCapture />
          </div>
        );
      case 'records':
        return (
          <div style={{ padding: '20px' }}>
            <h2>Attendance Records</h2>
            <p>Total records: {state.attendanceRecords.length}</p>
          </div>
        );
      default:
        return <EnrollmentForm onSuccess={handleEnrollmentSuccess} />;
    }
  };

  // Loading state UI
  if (state.isInitializing) {
    return (
      <div className="app-container loading">
        <div className="loader">
          <h2>Initializing Face Recognition Engine</h2>
          <div className="spinner"></div>
          <p>Setting up face-api.js...</p>
          {state.initError && <p style={{ color: '#e74c3c', marginTop: '15px' }}>{state.initError}</p>}
        </div>
      </div>
    );
  }

  // Navigation button styling function
  const getNavButtonStyle = (page: PageType) => ({
    padding: '10px 18px',
    backgroundColor: state.currentPage === page ? '#3498db' : '#ecf0f1',
    color: state.currentPage === page ? 'white' : '#2c3e50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: state.currentPage === page ? '600' : '500',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap' as const,
  });

  // Main render
  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="app-nav">
        <h1 style={{ margin: '0', marginRight: 'auto', fontSize: '22px', color: 'white', fontWeight: 700 }}>
          Sri Nataraja Kalaniketan
        </h1>

        <button onClick={() => handlePageChange('enrollment')} style={getNavButtonStyle('enrollment')} className="nav-btn">
          📝 Enrollment
        </button>

        <button onClick={() => handlePageChange('attendance')} style={getNavButtonStyle('attendance')} className="nav-btn">
          ✓ Attendance
        </button>

        <button onClick={() => handlePageChange('students')} style={getNavButtonStyle('students')} className="nav-btn">
          👥 Students
        </button>

        <button onClick={() => handlePageChange('records')} style={getNavButtonStyle('records')} className="nav-btn">
          📊 Records
        </button>

        <button onClick={() => handlePageChange('test')} style={getNavButtonStyle('test')} className="nav-btn">
          🧪 Test
        </button>

        <span
          style={{
            fontSize: '12px',
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          ✓ face-api.js Ready
        </span>
      </nav>

      {/* Main Content Area */}
      <div className="app-content">{renderPageContent()}</div>
    </div>
  );
}

export default App;
