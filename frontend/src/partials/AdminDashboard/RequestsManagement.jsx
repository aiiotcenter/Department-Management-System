import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

export default function RequestsManagement() {
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [allRequests, setAllRequests] = useState([]);
    const { t } = useTranslation();

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
    const [internships, setInternships] = useState([]);

    // Combine both types of requests and update when either changes
    useEffect(() => {
        // Create a unique identifier for each request to prevent duplicates
        const allRequestsMap = new Map();

        // Add appointments
        appointments.forEach((appointment) => {
            const key = `appointment-${appointment._id}`;
            allRequestsMap.set(key, appointment);
        });

        // Add internships
        internships.forEach((internship) => {
            const key = `internship-${internship._id}`;
            allRequestsMap.set(key, internship);
        });

        // Convert map values to array
        setAllRequests(Array.from(allRequestsMap.values()));
    }, [appointments, internships]);

    // Fetch real internship applications from backend
    useEffect(() => {
        setNotification({ show: false, type: '', message: '' });
        fetch('http://localhost:3001/api/internship_application', {
            credentials: 'include',
        })
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        throw new Error('You are not authorized. Please login first.');
                    }
                    return res.json().then((data) => {
                        throw new Error(data.message || `Server error: ${res.status}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    // Add the type field to each internship record for filtering
                    const formattedData = data.map((item) => ({
                        ...item,
                        type: 'internship',
                        username: item.User_name || 'Unknown', // Map User_name to username for consistency
                        // Make sure status is standardized (convert "waiting" to "pending" for consistency)
                        status:
                            (item.status || '').toLowerCase() === 'waiting'
                                ? 'pending'
                                : (item.status || '').toLowerCase(),
                    }));
                    setInternships(formattedData);
                } else if (data.message) {
                    // Handle message response (like "No internship applications exist")
                    setInternships([]);
                    // Show notification for no applications
                    setNotification({
                        show: true,
                        type: 'info',
                        message: data.message,
                    });
                    setTimeout(() => {
                        setNotification({ show: false, type: '', message: '' });
                    }, 3000);
                } else {
                    setInternships([]);
                }
            })
            .catch((error) => {
                setNotification({
                    show: true,
                    type: 'error',
                    message: error.message || 'Failed to fetch internship applications',
                });
                setTimeout(() => {
                    setNotification({ show: false, type: '', message: '' });
                }, 3000);
            });
    }, []);

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
                message: t('adminDashboard.notifications.appointmentApproved'),
            });
        } else if (type === 'internship') {
            // Send update request to backend
            fetch(`http://localhost:3001/api/internship_application`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id, status: 'approved' }),
            })
                .then((res) => {
                    if (!res.ok) {
                        if (res.status === 401) {
                            throw new Error('You are not authorized to perform this action');
                        }
                        return res.json().then((data) => {
                            throw new Error(data.message || `Server error: ${res.status}`);
                        });
                    }
                    return res.json();
                })
                .then(() => {
                    // Update local state only after successful backend update
                    setInternships(
                        internships.map((internship) =>
                            internship._id === parseInt(id) ? { ...internship, status: 'approved' } : internship
                        )
                    );
                    setNotification({
                        show: true,
                        type: 'success',
                        message: t('adminDashboard.notifications.internshipApproved'),
                    });

                    // Refresh internship applications after 1 second
                    setTimeout(() => {
                        fetch('http://localhost:3001/api/internship_application', {
                            credentials: 'include',
                        })
                            .then((res) => (res.ok ? res.json() : []))
                            .then((data) => {
                                if (Array.isArray(data)) {
                                    const formattedData = data.map((item) => ({
                                        ...item,
                                        type: 'internship',
                                        username: item.User_name || 'Unknown',
                                        status:
                                            (item.status || '').toLowerCase() === 'waiting'
                                                ? 'pending'
                                                : (item.status || '').toLowerCase(),
                                    }));
                                    setInternships(formattedData);
                                }
                            })
                            .catch(() => {});
                    }, 1000);
                })
                .catch((error) => {
                    setNotification({
                        show: true,
                        type: 'error',
                        message: error.message || 'Error approving internship application',
                    });
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
                message: t('adminDashboard.notifications.appointmentRejected'),
            });
        } else if (type === 'internship') {
            // Send update request to backend
            fetch(`http://localhost:3001/api/internship_application`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id, status: 'rejected' }),
            })
                .then((res) => {
                    if (!res.ok) {
                        if (res.status === 401) {
                            throw new Error('You are not authorized to perform this action');
                        }
                        return res.json().then((data) => {
                            throw new Error(data.message || `Server error: ${res.status}`);
                        });
                    }
                    return res.json();
                })
                .then(() => {
                    // Update local state only after successful backend update
                    setInternships(
                        internships.map((internship) =>
                            internship._id === parseInt(id) ? { ...internship, status: 'rejected' } : internship
                        )
                    );
                    setNotification({
                        show: true,
                        type: 'success',
                        message: t('adminDashboard.notifications.internshipRejected'),
                    });

                    // Refresh internship applications after 1 second
                    setTimeout(() => {
                        fetch('http://localhost:3001/api/internship_application', {
                            credentials: 'include',
                        })
                            .then((res) => (res.ok ? res.json() : []))
                            .then((data) => {
                                if (Array.isArray(data)) {
                                    const formattedData = data.map((item) => ({
                                        ...item,
                                        type: 'internship',
                                        username: item.User_name || 'Unknown',
                                        status:
                                            (item.status || '').toLowerCase() === 'waiting'
                                                ? 'pending'
                                                : (item.status || '').toLowerCase(),
                                    }));
                                    setInternships(formattedData);
                                }
                            })
                            .catch(() => {});
                    }, 1000);
                })
                .catch((error) => {
                    setNotification({
                        show: true,
                        type: 'error',
                        message: error.message || 'Error rejecting internship application',
                    });
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
                message: t('adminDashboard.notifications.appointmentDeleted'),
            });
        } else if (type === 'internship') {
            // Send delete request to backend
            fetch(`http://localhost:3001/api/internship_application/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            })
                .then((res) => {
                    if (!res.ok) {
                        if (res.status === 401) {
                            throw new Error('You are not authorized to perform this action');
                        }
                        return res.json().then((data) => {
                            throw new Error(data.message || `Server error: ${res.status}`);
                        });
                    }
                    return res.ok ? { success: true, id } : res.json();
                })
                .then((data) => {
                    if (data.success || data.id) {
                        // Update local state after successful deletion
                        setInternships(internships.filter((internship) => internship._id !== parseInt(id)));

                        setNotification({
                            show: true,
                            type: 'success',
                            message: t('adminDashboard.notifications.internshipDeleted'),
                        });

                        // Refresh internship applications after 1 second
                        setTimeout(() => {
                            fetch('http://localhost:3001/api/internship_application', {
                                credentials: 'include',
                            })
                                .then((res) => (res.ok ? res.json() : []))
                                .then((data) => {
                                    if (Array.isArray(data)) {
                                        const formattedData = data.map((item) => ({
                                            ...item,
                                            type: 'internship',
                                            username: item.User_name || 'Unknown',
                                            status:
                                                (item.status || '').toLowerCase() === 'waiting'
                                                    ? 'pending'
                                                    : (item.status || '').toLowerCase(),
                                        }));
                                        setInternships(formattedData);
                                    }
                                })
                                .catch(() => {});
                        }, 1000);
                    } else {
                        throw new Error(data.message || 'Failed to delete internship application');
                    }
                })
                .catch((error) => {
                    setNotification({
                        show: true,
                        type: 'error',
                        message: error.message || 'Error deleting internship application',
                    });
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
            <h2 className="form-title">{t('adminDashboard.requestsManagement.title')}</h2>

            {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            <div className="filter-container">
                <label htmlFor="requestTypeFilter">{t('adminDashboard.requestsManagement.type')}:</label>
                <select
                    id="requestTypeFilter"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">{t('adminDashboard.requestsManagement.allTypes')}</option>
                    <option value="appointment">{t('adminDashboard.requestsManagement.appointments')}</option>
                    <option value="internship">{t('adminDashboard.requestsManagement.internships')}</option>
                </select>

                <label htmlFor="statusFilter">{t('adminDashboard.requestsManagement.status')}:</label>
                <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">{t('adminDashboard.requestsManagement.allStatuses')}</option>
                    <option value="pending">{t('adminDashboard.requestsManagement.pending')}</option>
                    <option value="approved">{t('adminDashboard.requestsManagement.approved')}</option>
                    <option value="rejected">{t('adminDashboard.requestsManagement.rejected')}</option>
                </select>
            </div>

            <div className="admin-panel">
                <h3>{t('adminDashboard.requestsManagement.requests')}</h3>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t('adminDashboard.requestsManagement.name')}</th>
                                <th>{t('adminDashboard.requestsManagement.type')}</th>
                                <th>{t('adminDashboard.requestsManagement.purposeUniversity')}</th>
                                <th>{t('adminDashboard.requestsManagement.dateDepartment')}</th>
                                <th>{t('adminDashboard.requestsManagement.timeDuration')}</th>
                                <th>{t('adminDashboard.requestsManagement.cv')}</th>
                                <th>{t('adminDashboard.requestsManagement.status')}</th>
                                <th>{t('adminDashboard.requestsManagement.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests().map((request) => (
                                <tr key={`${request.type}-${request._id}`}>
                                    <td>{request.username}</td>
                                    <td className="request-type">
                                        {request.type === 'appointment'
                                            ? t('adminDashboard.requestsManagement.appointment')
                                            : t('adminDashboard.requestsManagement.internship')}
                                    </td>

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
                                        {request.type === 'internship' && request.cv ? (
                                            <a
                                                href={`http://localhost:3001/uploads/cvs/${request.cv}`}
                                                target="_blank"
                                                className="cv-link"
                                                rel="noreferrer"
                                                onClick={(e) => {
                                                    // Check if the CV file exists
                                                    fetch(`http://localhost:3001/uploads/cvs/${request.cv}`, {
                                                        method: 'HEAD',
                                                    })
                                                        .then((response) => {
                                                            if (!response.ok) {
                                                                e.preventDefault();
                                                                alert(
                                                                    'CV file not found. The file may have been deleted or not uploaded correctly.'
                                                                );
                                                            }
                                                        })
                                                        .catch(() => {
                                                            e.preventDefault();
                                                            alert('Cannot access CV file. Please try again later.');
                                                        });
                                                }}
                                            >
                                                View CV
                                            </a>
                                        ) : (
                                            'No CV uploaded'
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${request.status || 'pending'}`}>
                                            {t(
                                                `adminDashboard.requestsManagement.${(request.status || '').toLowerCase()}`
                                            ) || request.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="icon-actions">
                                            <button
                                                className="icon-button approve-icon"
                                                onClick={() => handleApprove(request._id, request.type)}
                                                disabled={request.status === 'approved'}
                                                title={t('adminDashboard.actions.approve')}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                className="icon-button reject-icon"
                                                onClick={() => handleReject(request._id, request.type)}
                                                disabled={request.status === 'rejected'}
                                                title={t('adminDashboard.actions.reject')}
                                            >
                                                <FaTimes />
                                            </button>
                                            <button
                                                className="icon-button delete-icon"
                                                onClick={() => handleDelete(request._id, request.type)}
                                                title={t('adminDashboard.actions.delete')}
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
