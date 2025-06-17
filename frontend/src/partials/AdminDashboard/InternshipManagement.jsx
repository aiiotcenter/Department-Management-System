import { useState } from 'react';

export default function InternshipManagement() {
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    // Mock data with state that can be modified
    const [applications, setApplications] = useState([
        {
            _id: '1',
            User_ID: '101',
            username: 'Alex Thompson',
            department: 'Computer Science',
            period_of_internship: '3 months',
            status: 'waiting',
            additional_notes: 'Interested in web development',
        },
        {
            _id: '2',
            User_ID: '102',
            username: 'Emma Wilson',
            department: 'Electrical Engineering',
            period_of_internship: '6 months',
            status: 'Approved',
            additional_notes: 'Experience with circuit design',
        },
        {
            _id: '3',
            User_ID: '103',
            username: 'Daniel Brown',
            department: 'Mechanical Engineering',
            period_of_internship: '4 months',
            status: 'waiting',
            additional_notes: 'Keen to learn about automotive systems',
        },
        {
            _id: '4',
            User_ID: '104',
            username: 'Sophia Lee',
            department: 'Information Technology',
            period_of_internship: '2 months',
            status: 'Rejected',
            additional_notes: 'Interested in cybersecurity',
        },
    ]);

    // Mock functions that update UI state in real-time
    const handleApprove = (id) => {
        // Update the application status in the state
        setApplications(
            applications.map((application) =>
                application._id === id ? { ...application, status: 'Approved' } : application
            )
        );

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: 'Internship application approved successfully (Mock)',
        });
    };

    const handleReject = (id) => {
        // Update the application status in the state
        setApplications(
            applications.map((application) =>
                application._id === id ? { ...application, status: 'Rejected' } : application
            )
        );

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: 'Internship application rejected successfully (Mock)',
        });
    };

    return (
        <div>
            <h2 className="form-title">Internship Applications</h2>

            {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            <div className="admin-panel">
                <h3>Pending Applications</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Period</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications
                            .filter((app) => app.status === 'waiting')
                            .map((application) => (
                                <tr key={application._id}>
                                    <td>{application.username}</td>
                                    <td>{application.department}</td>
                                    <td>{application.period_of_internship}</td>
                                    <td>
                                        <span className={`status-badge status-${application.status}`}>
                                            {application.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="button-group">
                                            <button
                                                className="action-button approve-button"
                                                onClick={() => handleApprove(application._id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="action-button reject-button"
                                                onClick={() => handleReject(application._id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="admin-panel">
                <h3>All Applications</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Period</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                            <tr key={application._id}>
                                <td>{application.username}</td>
                                <td>{application.department}</td>
                                <td>{application.period_of_internship}</td>
                                <td>
                                    <span className={`status-badge status-${application.status}`}>
                                        {application.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
