import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import CameraCapture from './components/CameraCapture';
import EnrollmentForm from './components/EnrollmentForm';
import { faceEngine } from './core/faceEngine';
import StudentsListTab from './components/StudentsListTab';
// import AttendanceRecordsTab from './components/AttendanceRecordsTab';

function App() {
  const [currentPage, setCurrentPage] = useState<'enrollment' | 'attendance' | 'students' | 'records' | 'test'>('enrollment');
  const [enrolledCount, setEnrolledCount] = useState(0);
  
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize the face recognition engine using face-api.js
    const initializeFaceEngine = async () => {
      try {
        console.log('Initializing Face Engine (face-api.js)...');
        await faceEngine.initialize();
        console.log('✓ Face Engine initialized successfully');
        
        // Load enrollment data from localStorage
        const storedStudents = localStorage.getItem('enrolledStudents');
        if (storedStudents) {
          try {
            const students = JSON.parse(storedStudents);
            setEnrolledCount(students.length);
          } catch (e) {
            console.error('Error parsing stored students:', e);
          }
        }
        
        // Load attendance records
        const storedRecords = localStorage.getItem('attendanceRecords');
        if (storedRecords) {
          try {
            const records = JSON.parse(storedRecords);
            setAttendanceRecords(records);
          } catch (e) {
            console.error('Error parsing attendance records:', e);
          }
        }
      } catch (error) {
        console.error('Failed to initialize Face Engine:', error);
        setInitError(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeFaceEngine();
  }, []);

  if (isInitializing) {
    return (
      <div className="App">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontSize: '18px',
          color: '#666',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <p>Initializing Face Recognition Engine...</p>
            {initError && <p style={{ color: 'red', marginTop: '10px' }}>{initError}</p>}
          </div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
case 'enrollment':
      return (
        <EnrollmentForm
          onSuccess={() => {
            setCurrentPage('attendance');
          }}
        />
      );
    case 'attendance':
      return (
        <Dashboard
          enrolledCount={enrolledCount}
          attendanceLogs={attendanceRecords}
        />
      );
    case 'test':
      return (
        <div>
          <h2>Test Page</h2>
          <p>Face Recognition Testing</p>
        </div>
      );
            case 'students':
      return <StudentsListTab students={[]} />;
//     case 'records':
      // return <AttendanceRecordsTab attendanceLogs={attendanceRecords} />;
      // );
    default:
      return (
        <EnrollmentForm
          onSuccess={() => {
            setCurrentPage('attendance');
          }}
        />
      );
  }
};

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        gap: '10px',
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0', marginRight: 'auto', fontSize: '20px', color: '#333' }}>Sri Nataraja Kalaniketan</h1>
        
        <button
          onClick={() => setCurrentPage('enrollment')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === 'enrollment' ? '#007bff' : '#e9ecef',
            color: currentPage === 'enrollment' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: currentPage === 'enrollment' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          📝 Enrollment
        </button>
        
        <button
          onClick={() => setCurrentPage('attendance')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === 'attendance' ? '#28a745' : '#e9ecef',
            color: currentPage === 'attendance' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: currentPage === 'attendance' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          ✓ Attendance
        </button>
                <button
          onClick={() => setCurrentPage('students')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === 'students' ? '#d4edda' : '#f8f9fa',
            color: currentPage === 'students' ? '#155724' : '#495057',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: currentPage === 'students' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          👥 Students
        </button>

        <button
          onClick={() => setCurrentPage('records')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === 'records' ? '#cce5ff' : '#f8f9fa',
            color: currentPage === 'records' ? '#004085' : '#495057',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: currentPage === 'records' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          📊 Records
        </button>
        

        <span style={{
          fontSize: '12px',
          color: '#666',
          backgroundColor: '#d4edda',
          padding: '4px 8px',
          borderRadius: '3px',
          border: '1px solid #c3e6cb',
          marginLeft: 'auto'
        }}>
          ✓ face-api.js Ready
        </span>
      </nav>
      
      {/* Main Content */}
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;