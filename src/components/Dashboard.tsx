import React from 'react';

interface DashboardProps {
  enrolledCount: number;
  attendanceRecords: Array<{
    studentId: string;
    name: string;
    status: 'present' | 'absent';
    timestamp: string;
  }>;
}

const Dashboard: React.FC<DashboardProps> = ({ enrolledCount, attendanceRecords }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Attendance Dashboard</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Statistics</h2>
        <p>Total Enrolled Students: <strong>{enrolledCount}</strong></p>
        <p>Attendance Records: <strong>{attendanceRecords.length}</strong></p>
      </div>
      <div>
        <h2>Recent Records</h2>
        {attendanceRecords.length === 0 ? (
          <p>No attendance records yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Student ID</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{record.studentId}</td>
                  <td style={{ padding: '8px' }}>{record.name}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: record.status === 'present' ? '#d4edda' : '#f8d7da',
                      color: record.status === 'present' ? '#155724' : '#721c24'
                    }}>
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '8px' }}>{record.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;