import { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

export default function RequestsManagement() {
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [allRequests, setAllRequests] = useState([]);

    // Mock appointment data
    const [appointments, setAppointments] = useState([
        {
            _id: '1',
            type: 'appointment',
            username: 'John Doe',
            visit_purpose: 'Academic Advising',
            visit_date: '2023-06-20',
            visit_time: '14:00',
            status: 'pending',
            comments: 'Need to discuss course selection',
        },
        {
            _id: '2',
            type: 'appointment',
            username: 'Jane Smith',
            visit_purpose: 'Career Guidance',
            visit_date: '2023-06-21',
            visit_time: '10:30',
            status: 'approved',
            comments: 'Seeking advice on internship opportunities',
        },
        {
            _id: '3',
            type: 'appointment',
            username: 'Mike Johnson',
            visit_purpose: 'Research Project',
            visit_date: '2023-06-22',
            visit_time: '15:45',
            status: 'pending',
            comments: 'Want to discuss potential research topics',
        },
        {
            _id: '4',
            type: 'appointment',
            username: 'Sarah Williams',
            visit_purpose: 'Graduation Requirements',
            visit_date: '2023-06-23',
            visit_time: '11:15',
            status: 'rejected',
            comments: 'Need to check remaining courses for graduation',
        },
    ]);

    // Mock internship data
    const [internships, setInternships] = useState([
        {
            _id: '1',
            type: 'internship',
            User_ID: '101',
            username: 'Alex Thompson',
            university: 'MIT',
            department: 'Computer Science',
            period_of_internship: '3 months',
            cv: 'alex_cv.pdf',
            status: 'pending',
            additional_notes: 'Interested in web development',
        },
        {
            _id: '2',
            type: 'internship',
            User_ID: '102',
            username: 'Emma Wilson',
            university: 'Stanford',
            department: 'Electrical Engineering',
            period_of_internship: '6 months',
            cv: 'emma_cv.pdf',
            status: 'approved',
            additional_notes: 'Experience with circuit design',
        },
        {
            _id: '3',
            type: 'internship',
            User_ID: '103',
            username: 'Daniel Brown',
            university: 'Harvard',
            department: 'Mechanical Engineering',
            period_of_internship: '4 months',
            cv: 'daniel_cv.pdf',
            status: 'pending',
            additional_notes: 'Keen to learn about automotive systems',
        },
        {
            _id: '4',
            type: 'internship',
            User_ID: '104',
            username: 'Sophia Lee',
            university: 'Berkeley',
            department: 'Information Technology',
            period_of_internship: '2 months',
            cv: 'sophia_cv.pdf',
            status: 'rejected',
            additional_notes: 'Interested in cybersecurity',
        },
    ]);

    // Combine both types of requests and update when either changes
    useEffect(() => {
        setAllRequests([...appointments, ...internships]);
    }, [appointments, internships]);

    // Handle approve action
    const handleApprove = (id, type) => {
        if (type === 'appointment') {
            setAppointments(
                appointments.map((appointment) =>
                    appointment._id === id ? { ...appointment, status: 'approved' } : appointment
                )
            );
            setNotification({
                show: true,
                type: 'success',
                message: 'Appointment request approved successfully',
            });
        } else if (type === 'internship') {
            setInternships(
                internships.map((internship) =>
                    internship._id === id ? { ...internship, status: 'approved' } : internship
                )
            );
            setNotification({
                show: true,
                type: 'success',
                message: 'Internship application approved successfully',
            });
        }

        // Hide notification after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 3000);
    };

    // Handle reject action
    const handleReject = (id, type) => {
        if (type === 'appointment') {
            setAppointments(
                appointments.map((appointment) =>
                    appointment._id === id ? { ...appointment, status: 'rejected' } : appointment
                )
            );
            setNotification({
                show: true,
                type: 'success',
                message: 'Appointment request rejected successfully',
            });
        } else if (type === 'internship') {
            setInternships(
                internships.map((internship) =>
                    internship._id === id ? { ...internship, status: 'rejected' } : internship
                )
            );
            setNotification({
                show: true,
                type: 'success',
                message: 'Internship application rejected successfully',
            });
        }

        // Hide notification after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 3000);
    };

    // Handle delete action
    const handleDelete = (id, type) => {
        if (type === 'appointment') {
            setAppointments(appointments.filter((appointment) => appointment._id !== id));
            setNotification({
                show: true,
                type: 'success',
                message: 'Appointment request deleted successfully',
            });
        } else if (type === 'internship') {
            setInternships(internships.filter((internship) => internship._id !== id));
            setNotification({
                show: true,
                type: 'success',
                message: 'Internship application deleted successfully',
            });
        }

        // Hide notification after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 3000);
    };

    // Filter requests based on selected type and status
    const filteredRequests = () => {
        let filtered = allRequests;

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter((request) => request.type === filterType);
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter((request) => request.status === filterStatus);
        }

        return filtered;
    };

    return (
        <div>
            <h2 className="form-title">Requests Management</h2>

            {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            <div className="filter-container">
                <label htmlFor="requestTypeFilter">Type:</label>
                <select
                    id="requestTypeFilter"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Types</option>
                    <option value="appointment">Appointments</option>
                    <option value="internship">Internships</option>
                </select>

                <label htmlFor="statusFilter">Status:</label>
                <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="admin-panel">
                <h3>Requests</h3>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Purpose/University</th>
                                <th>Date/Department</th>
                                <th>Time/Duration</th>
                                <th>CV</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests().map((request) => (
                                <tr key={`${request.type}-${request._id}`}>
                                    <td>{request.username}</td>
                                    <td className="request-type">{request.type}</td>

                                    {/* Dynamic content based on request type */}
                                    <td>
                                        {request.type === 'appointment' ? request.visit_purpose : request.university}
                                    </td>
                                    <td>{request.type === 'appointment' ? request.visit_date : request.department}</td>
                                    <td>
                                        {request.type === 'appointment'
                                            ? request.visit_time
                                            : request.period_of_internship}
                                    </td>
                                    <td>
                                        {request.type === 'internship' ? (
                                            <a href="#" className="cv-link">
                                                {request.cv}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${request.status}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="icon-actions">
                                            <button
                                                className="icon-button approve-icon"
                                                onClick={() => handleApprove(request._id, request.type)}
                                                disabled={request.status === 'approved'}
                                                title="Approve"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                className="icon-button reject-icon"
                                                onClick={() => handleReject(request._id, request.type)}
                                                disabled={request.status === 'rejected'}
                                                title="Reject"
                                            >
                                                <FaTimes />
                                            </button>
                                            <button
                                                className="icon-button delete-icon"
                                                onClick={() => handleDelete(request._id, request.type)}
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
