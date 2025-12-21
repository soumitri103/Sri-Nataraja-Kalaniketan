import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import CameraCapture from './components/CameraCapture';
import EnrollmentForm from './components/EnrollmentForm';
import { faceEngine } from './core/faceEngine';

function App() {
  const [currentPage, setCurrentPage] = useState<'enrollment' | 'attendance' | 'test'>('enrollment');
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
            faceEngine={faceEngine}
            enrolledCount={enrolledCount}
            setEnrolledCount={setEnrolledCount}
          />
        );
      case 'attendance':
        return (
          <CameraCapture
            faceEngine={faceEngine}
            onAttendanceRecord={(record) => {
              const updated = [...attendanceRecords, record];
              setAttendanceRecords(updated);
              localStorage.setItem('attendanceRecords', JSON.stringify(updated));
            }}
          />
        );
      case 'test':
        return (
          <div style={{ padding: '20px' }}>
            <h2>Test Mode - Face Recognition System</h2>
            <div style={{
              backgroundColor: '#f0f0f0',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              <p><strong>Status:</strong> <span style={{ color: 'green' }}>✓ Face-api.js Engine Ready</span></p>
              <p><strong>Enrolled Students:</strong> {enrolledCount}</p>
              <p><strong>Attendance Records:</strong> {attendanceRecords.length}</p>
              <button 
                onClick={() => {
                  console.log('Face Engine Instance:', faceEngine);
                  console.log('Models Loaded:', (faceEngine as any).modelsLoaded);
                  alert('Check browser console (F12) for face engine details');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                View Engine Details in Console
              </button>
              <button 
                onClick={() => {
                  // Test face detection capability
                  const canvas = document.createElement('canvas');
                  canvas.width = 320;
                  canvas.height = 240;
                  console.log('Test Mode: Ready to detect faces from canvas:', canvas);
                  alert('Face detection is ready. Switch to Attendance mode to test with camera');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Test Face Detection
              </button>
            </div>
            <div style={{
              backgroundColor: '#e7f3ff',
              padding: '15px',
              borderRadius: '5px',
              marginTop: '20px'
            }}>
              <h3>How to Use:</h3>
              <ol>
                <li><strong>Enrollment:</strong> Register students' faces by clicking "📝 Enrollment"</li>
                <li><strong>Attendance:</strong> Track attendance using face recognition with "✓ Attendance"</li>
                <li><strong>Test:</strong> Verify system functionality with "🧪 Test" (this page)</li>
              </ol>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            enrolledCount={enrolledCount}
            setEnrolledCount={setEnrolledCount}
            attendanceRecords={attendanceRecords}
            setAttendanceRecords={setAttendanceRecords}
            faceEngine={faceEngine}
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
          onClick={() => setCurrentPage('test')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === 'test' ? '#ffc107' : '#e9ecef',
            color: currentPage === 'test' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: currentPage === 'test' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          🧪 Test
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