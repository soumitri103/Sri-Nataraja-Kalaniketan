import { useState, useEffect, useRef } from 'react';
import { faceEngine } from './core/faceEngine';
import { AttendanceDB } from './core/database';
import CameraCapture from './components/CameraCapture';
import EnrollmentForm from './components/EnrollmentForm';
import AttendanceMarker from './components/AttendanceMarker';
import Dashboard from './components/Dashboard';
import './App.css';

type AppPage = 'enrollment' | 'attendance' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await faceEngine.initialize();
        const savedFaceData = AttendanceDB.getFaceData();
        if (savedFaceData) {
          faceEngine.importData(savedFaceData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className="app-container loading">
        <div className="loader">
          <h2>Initializing Face Recognition System...</h2>
          <p>Loading models and data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sri Nataraja Kalaniketan - Attendance Tracking</h1>
        <p>Face Recognition Based Attendance System</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${currentPage === 'enrollment' ? 'active' : ''}`}
          onClick={() => setCurrentPage('enrollment')}
        >
          📝 Enrollment
        </button>
        <button
          className={`nav-btn ${currentPage === 'attendance' ? 'active' : ''}`}
          onClick={() => setCurrentPage('attendance')}
        >
          ✓ Mark Attendance
        </button>
        <button
          className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentPage('dashboard')}
        >
          📊 Dashboard
        </button>
      </nav>

      <main className="app-main">
        {currentPage === 'enrollment' && <EnrollmentForm onSuccess={() => setCurrentPage('dashboard')} />}
        {currentPage === 'attendance' && <AttendanceMarker />}
        {currentPage === 'dashboard' && <Dashboard />}
      </main>

      <footer className="app-footer">
        <p>© 2024 Sri Nataraja Kalaniketan Institute. Face Recognition Attendance System v1.0</p>
      </footer>
    </div>
  );
}

export default App;
