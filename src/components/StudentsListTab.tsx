import React from 'react';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  email?: string;
  enrolledAt?: string;
}

interface StudentsListTabProps {
  students: Student[];
}

const StudentsListTab: React.FC<StudentsListTabProps> = ({ students }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN');
    } catch {
      return dateString;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Enrolled Students</h1>
      <div style={{ marginBottom: '20px' }}>
        <p>Total Enrolled: <strong style={{ color: 'blue', fontSize: '18px' }}>{students.length}</strong> students</p>
      </div>

      {students.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>No students enrolled yet.</p>
          <p style={{ color: '#999', fontSize: '14px' }}>Students will appear here after enrollment and face registration.</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #007bff', backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#007bff' }}>Student ID</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#007bff' }}>Full Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#007bff' }}>Roll Number</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#007bff' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#007bff' }}>Enrolled Date</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#007bff' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={{ padding: '12px' }}>
                  <strong style={{ color: '#333' }}>{student.id}</strong>
                </td>
                <td style={{ padding: '12px' }}>{student.name}</td>
                <td style={{ padding: '12px' }}>{student.rollNo}</td>
                <td style={{ padding: '12px' }}>{student.email || '-'}</td>
                <td style={{ padding: '12px' }}>
                  {formatDate(student.enrolledAt)}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    ✓ Registered
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentsListTab;