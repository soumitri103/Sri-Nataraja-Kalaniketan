import React from 'react';

interface AttendanceLog {
  studentId: string;
  name: string;
  entryTime?: string;  // First check-in time
  exitTime?: string;   // Last check-out time
  status: 'present' | 'absent';
}

interface DashboardProps {
  enrolledCount: number;
  attendanceLogs: AttendanceLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ enrolledCount, attendanceLogs }) => {
  // Calculate statistics
  const presentCount = attendanceLogs.filter(log => log.status === 'present').length;
  const absentCount = attendanceLogs.filter(log => log.status === 'absent').length;
  const totalRecords = attendanceLogs.length;

  // Format timestamp to readable time
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '-';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return timestamp;
    }
  };

  // Format date for display
  const formatDate = (timestamp?: string) => {
    if (!timestamp) return '-';
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-IN');
    } catch {
      return timestamp;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Attendance Dashboard</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Statistics</h2>
        <p>Total Enrolled Students: <strong>{enrolledCount}</strong></p>
        <p>Present Today: <strong style={{ color: 'green' }}>{presentCount}</strong></p>
        <p>Absent Today: <strong style={{ color: 'red' }}>{absentCount}</strong></p>
        <p>Total Attendance Records: <strong>{totalRecords}</strong></p>
      </div>

      <div>
        <h2>Recent Records</h2>
        {attendanceLogs.length === 0 ? (
          <p>No attendance records yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Student ID</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Entry Time</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Exit Time</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {attendanceLogs.map((record, index) => {
                // Calculate duration between entry and exit
                let duration = '-';
                if (record.entryTime && record.exitTime) {
                  try {
                    const entryDate = new Date(record.entryTime);
                    const exitDate = new Date(record.exitTime);
                    const diffMs = exitDate.getTime() - entryDate.getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    const hours = Math.floor(diffMins / 60);
                    const mins = diffMins % 60;
                    duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                  } catch {
                    duration = '-';
                  }
                }

                return (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>
                      <strong>{record.studentId}</strong>
                    </td>
                    <td style={{ padding: '8px' }}>{record.name}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{ color: 'green', fontWeight: 'bold' }}>
                        {formatTime(record.entryTime)}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>
                      {record.exitTime ? (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>
                          {formatTime(record.exitTime)}
                        </span>
                      ) : (
                        <span style={{ color: 'blue' }}>In Progress</span>
                      )}
                    </td>
                    <td style={{ padding: '8px' }}>
                      {record.entryTime && formatDate(record.entryTime)}
                    </td>
                    <td style={{ padding: '8px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: record.status === 'present' ? '#d4edda' : '#f8d7da',
                          color: record.status === 'present' ? '#155724' : '#721c24',
                          fontWeight: 'bold'
                        }}
                      >
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <strong>{duration}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;