import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import './RequestsManagement.css';

export default function RequestsManagement() {
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [allRequests, setAllRequests] = useState([]);
    const { t } = useTranslation();

    // Mock appointment data - will be replaced with real data from backend
    const [appointments, setAppointments] = useState([]);

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

    // Fetch real appointment data from backend
    useEffect(() => {
        fetch('http://localhost:3001/api/appointment/all', {
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
                    // Add the type field and format data for consistency
                    const formattedData = data.map((item) => ({
                        ...item,
                        _id: item.Appointment_ID,
                        type: 'appointment',
                        username: item.username || 'Unknown',
                        visit_purpose: item.Visit_purpose,
                        visit_date: item.Visit_date,
                        visit_time: item.Visit_time,
                        comments: item.Comments,
                        // Convert status to lowercase and map "waiting" to "pending"
                        status:
                            (item.Status || '').toLowerCase() === 'waiting'
                                ? 'pending'
                                : (item.Status || '').toLowerCase(),
                    }));
                    setAppointments(formattedData);
                } else if (data.message) {
                    // Handle message response (like "No appointments exist")
                    setAppointments([]);
                    if (!data.message.includes('No appointments exist')) {
                        setNotification({
                            show: true,
                            type: 'info',
                            message: data.message,
                        });
                        setTimeout(() => {
                            setNotification({ show: false, type: '', message: '' });
                        }, 3000);
                    }
                } else {
                    setAppointments([]);
                }
            })
            .catch((error) => {
                setNotification({
                    show: true,
                    type: 'error',
                    message: error.message || 'Failed to fetch appointments',
                });
                setTimeout(() => {
                    setNotification({ show: false, type: '', message: '' });
                }, 3000);
            });
    }, []);

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
            // Send update request to backend for appointments
            fetch(`http://localhost:3001/api/appointment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    Appointment_ID: id,
                    status: 'Approved',
                    QRcode_Expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
                }),
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

                    // Refresh appointments after 1 second
                    setTimeout(() => {
                        fetch('http://localhost:3001/api/appointment/all', {
                            credentials: 'include',
                        })
                            .then((res) => (res.ok ? res.json() : []))
                            .then((data) => {
                                if (Array.isArray(data)) {
                                    const formattedData = data.map((item) => ({
                                        ...item,
                                        _id: item.Appointment_ID,
                                        type: 'appointment',
                                        username: item.username || 'Unknown',
                                        visit_purpose: item.Visit_purpose,
                                        visit_date: item.Visit_date,
                                        visit_time: item.Visit_time,
                                        comments: item.Comments,
                                        status:
                                            (item.Status || '').toLowerCase() === 'waiting'
                                                ? 'pending'
                                                : (item.Status || '').toLowerCase(),
                                    }));
                                    setAppointments(formattedData);
                                }
                            })
                            .catch(() => {});
                    }, 1000);
                })
                .catch((error) => {
                    setNotification({
                        show: true,
                        type: 'error',
                        message: error.message || 'Error approving appointment',
                    });
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
            // Send update request to backend for appointments
            fetch(`http://localhost:3001/api/appointment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    Appointment_ID: id,
                    status: 'Declined',
                }),
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

                    // Refresh appointments after 1 second
                    setTimeout(() => {
                        fetch('http://localhost:3001/api/appointment/all', {
                            credentials: 'include',
                        })
                            .then((res) => (res.ok ? res.json() : []))
                            .then((data) => {
                                if (Array.isArray(data)) {
                                    const formattedData = data.map((item) => ({
                                        ...item,
                                        _id: item.Appointment_ID,
                                        type: 'appointment',
                                        username: item.username || 'Unknown',
                                        visit_purpose: item.Visit_purpose,
                                        visit_date: item.Visit_date,
                                        visit_time: item.Visit_time,
                                        comments: item.Comments,
                                        status:
                                            (item.Status || '').toLowerCase() === 'waiting'
                                                ? 'pending'
                                                : (item.Status || '').toLowerCase(),
                                    }));
                                    setAppointments(formattedData);
                                }
                            })
                            .catch(() => {});
                    }, 1000);
                })
                .catch((error) => {
                    setNotification({
                        show: true,
                        type: 'error',
                        message: error.message || 'Error rejecting appointment',
                    });
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
            // Send delete request to backend for appointments
            fetch(`http://localhost:3001/api/appointment/${id}`, {
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
                        setAppointments(appointments.filter((appointment) => appointment._id !== id));

                        setNotification({
                            show: true,
                            type: 'success',
                            message: t('adminDashboard.notifications.appointmentDeleted'),
                        });

                        // Refresh appointments after 1 second
                        setTimeout(() => {
                            fetch('http://localhost:3001/api/appointment/all', {
                                credentials: 'include',
                            })
                                .then((res) => (res.ok ? res.json() : []))
                                .then((data) => {
                                    if (Array.isArray(data)) {
                                        const formattedData = data.map((item) => ({
                                            ...item,
                                            _id: item.Appointment_ID,
                                            type: 'appointment',
                                            username: item.username || 'Unknown',
                                            visit_purpose: item.Visit_purpose,
                                            visit_date: item.Visit_date,
                                            visit_time: item.Visit_time,
                                            comments: item.Comments,
                                            status:
                                                (item.Status || '').toLowerCase() === 'waiting'
                                                    ? 'pending'
                                                    : (item.Status || '').toLowerCase(),
                                        }));
                                        setAppointments(formattedData);
                                    }
                                })
                                .catch(() => {});
                        }, 1000);
                    } else {
                        throw new Error(data.message || 'Failed to delete appointment');
                    }
                })
                .catch((error) => {
                    setNotification({
                        show: true,
                        type: 'error',
                        message: error.message || 'Error deleting appointment',
                    });
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
                    <table className="request-management-table">
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
                                                className="action-button approve-button"
                                                onClick={() => handleApprove(request._id, request.type)}
                                                disabled={request.status === 'approved'}
                                                title={t('adminDashboard.actions.approve')}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                className="action-button reject-button"
                                                onClick={() => handleReject(request._id, request.type)}
                                                disabled={request.status === 'rejected'}
                                                title={t('adminDashboard.actions.reject')}
                                            >
                                                <FaTimes />
                                            </button>
                                            <button
                                                className="action-button delete-button"
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
