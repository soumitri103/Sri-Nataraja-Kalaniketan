import { useState } from 'react';
import { faceEngine } from '../core/faceEngine';
import { AttendanceDB } from '../core/database';
import CameraCapture from './CameraCapture';

interface EnrollmentFormProps {
  onSuccess?: () => void;
}

function EnrollmentForm({ onSuccess }: EnrollmentFormProps) {
  const [step, setStep] = useState<'form' | 'camera' | 'success'>('form');
  const [studentData, setStudentData] = useState({
    id: '',
    name: '',
    rollNo: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData.id || !studentData.name || !studentData.rollNo) {
      setMessage('Please fill in all required fields');
      return;
    }
          // Save current student ID to localStorage for face capture
      localStorage.setItem('currentStudentId', studentData.id);
    setStep('camera');
  };

  const handleFaceCapture    = async (canvas: HTMLCanvasElement) => {
    setLoading(true);
    try {
      const descriptor = await faceEngine.extractFaceDescriptor(canvas);
      if (!descriptor) {
        setMessage('No face detected. Please try again.');
        setLoading(false);
        return;
      }

      await faceEngine.enrollFace(studentData.id, descriptor, studentData.name);
      
      await AttendanceDB.saveStudent({
        id: studentData.id,
        name: studentData.name,
        rollNo: studentData.rollNo,
        email: studentData.email,
      });

      const faceData = faceEngine.exportData();
      await AttendanceDB.saveFaceData(faceData);

      setStep('success');
    } catch (error) {
      setMessage('Error processing face. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStudentData({ id: '', name: '', rollNo: '', email: '' });
    setStep('form');
    setMessage('');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="enrollment-form-container">
      {step === 'form' && (
        <form className="enrollment-form" onSubmit={handleFormSubmit}>
          <h2>Student Enrollment</h2>
          <p>Register a new student for attendance tracking</p>
          
          <div className="form-group">
            <label htmlFor="id">Student ID *</label>
            <input
              id="id"
              name="id"
              type="text"
              value={studentData.id}
              onChange={handleInputChange}
              placeholder="Enter unique student ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={studentData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rollNo">Roll No *</label>
            <input
              id="rollNo"
              name="rollNo"
              type="text"
              value={studentData.rollNo}
              onChange={handleInputChange}
              placeholder="Enter roll number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={studentData.email}
              onChange={handleInputChange}
              placeholder="Enter email (optional)"
            />
          </div>

          {message && <div className="error-message">{message}</div>}

          <button className="btn-primary" type="submit">
            Proceed to Face Capture
          </button>
        </form>
      )}

      {step === 'camera' && (
        <div className="camera-section">
          <h2>Capture Student Face</h2>
          <p>Take a clear photo of the student's face for enrollment</p>
          {loading && <div className="loading-spinner">Processing face...</div>}
          {!loading && (
            <CameraCapture onCapture={(canvas) => handleFaceCapture(canvas)} />
          )}
        </div>
      )}

      {step === 'success' && (
        <div className="success-message">
          <h2>✓ Enrollment Successful!</h2>
          <p>Student {studentData.name} has been successfully enrolled.</p>
          <p>Face data has been saved and is ready for attendance marking.</p>
          <button className="btn-primary" onClick={resetForm}>
            Enroll Another Student
          </button>
        </div>
      )}
    </div>
  );
}

export default EnrollmentForm;
