import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

interface FaceEngineInterface {
  initialize: () => Promise<void>;
  detectFace: (canvas: HTMLCanvasElement) => Promise<any>;
  recognizeFace: (faceData: any) => Promise<string>;
}

// Placeholder face engine for now - will be replaced with WebAssembly version
const placeholderFaceEngine: FaceEngineInterface = {
  initialize: async () => {
    console.log('Placeholder face engine initialized');
  },
  detectFace: async (canvas) => {
    console.log('Placeholder: detecting face');
    return null;
  },
  recognizeFace: async (faceData) => {
    console.log('Placeholder: recognizing face');
    return 'Unknown';
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState('enrollment');
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [initError, setInitError] = useState<string | null>(null);
  const [faceEngine, setFaceEngine] = useState<FaceEngineInterface | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize the face recognition engine
    const initializeFaceEngine = async () => {
      try {
        console.log('Initializing Face Engine...');
        
        // For now, use placeholder engine
        // TODO: Replace with actual WebAssembly faceEngineWasm implementation
        await placeholderFaceEngine.initialize();
        setFaceEngine(placeholderFaceEngine);
        console.log('Face Engine initialized successfully');
        
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
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          <div>
            <p>Initializing Face Recognition Engine...</p>
            {initError && <p style={{ color: 'red', marginTop: '10px' }}>{initError}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {faceEngine ? (
        <Dashboard
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          enrolledCount={enrolledCount}
          setEnrolledCount={setEnrolledCount}
          attendanceRecords={attendanceRecords}
          setAttendanceRecords={setAttendanceRecords}
          faceEngine={faceEngine}
        />
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: 'red'
        }}>
          <div>
            <p>Face Recognition Engine Failed to Initialize</p>
            {initError && <p>{initError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;