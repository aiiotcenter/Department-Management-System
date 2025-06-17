import { useState } from 'react';

export default function AppointmentManagement() {
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    // Mock data with state that can be modified
    const [appointments, setAppointments] = useState([
        {
            _id: '1',
            username: 'John Doe',
            visit_purpose: 'Academic Advising',
            visit_date: '2023-06-20',
            visit_time: '14:00',
            status: 'waiting',
            comments: 'Need to discuss course selection',
        },
        {
            _id: '2',
            username: 'Jane Smith',
            visit_purpose: 'Career Guidance',
            visit_date: '2023-06-21',
            visit_time: '10:30',
            status: 'Approved',
            comments: 'Seeking advice on internship opportunities',
        },
        {
            _id: '3',
            username: 'Mike Johnson',
            visit_purpose: 'Research Project',
            visit_date: '2023-06-22',
            visit_time: '15:45',
            status: 'waiting',
            comments: 'Want to discuss potential research topics',
        },
        {
            _id: '4',
            username: 'Sarah Williams',
            visit_purpose: 'Graduation Requirements',
            visit_date: '2023-06-23',
            visit_time: '11:15',
            status: 'Rejected',
            comments: 'Need to check remaining courses for graduation',
        },
    ]);

    // Mock functions that update UI state in real-time
    const handleApprove = (id) => {
        // Update the appointment status in the state
        setAppointments(
            appointments.map((appointment) =>
                appointment._id === id ? { ...appointment, status: 'Approved' } : appointment
            )
        );

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: 'Appointment approved successfully (Mock)',
        });
    };

    const handleReject = (id) => {
        // Update the appointment status in the state
        setAppointments(
            appointments.map((appointment) =>
                appointment._id === id ? { ...appointment, status: 'Rejected' } : appointment
            )
        );

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: 'Appointment rejected successfully (Mock)',
        });
    };

    return (
        <div>
            <h2 className="form-title">Appointment Requests</h2>

            {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            <div className="admin-panel">
                <h3>Pending Appointments</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Purpose</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments
                            .filter((apt) => apt.status === 'waiting')
                            .map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>{appointment.username}</td>
                                    <td>{appointment.visit_purpose}</td>
                                    <td>{appointment.visit_date}</td>
                                    <td>{appointment.visit_time}</td>
                                    <td>
                                        <span className={`status-badge status-${appointment.status}`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="button-group">
                                            <button
                                                className="action-button approve-button"
                                                onClick={() => handleApprove(appointment._id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="action-button reject-button"
                                                onClick={() => handleReject(appointment._id)}
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
                <h3>All Appointments</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Purpose</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment._id}>
                                <td>{appointment.username}</td>
                                <td>{appointment.visit_purpose}</td>
                                <td>{appointment.visit_date}</td>
                                <td>{appointment.visit_time}</td>
                                <td>
                                    <span className={`status-badge status-${appointment.status}`}>
                                        {appointment.status}
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
