import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './AdminInternships.css';

const initialInternships = [
    {
        id: 1,
        title: 'Web Development Internship',
        description: 'Build and maintain web applications.',
        approvedStudents: [1, 2, 3],
    },
    {
        id: 2,
        title: 'AI Research Internship',
        description: 'Work on AI and ML projects.',
        approvedStudents: [4, 5],
    },
];

const students = [
    { id: 1, name: 'Alice Smith' },
    { id: 2, name: 'Bob Johnson' },
    { id: 3, name: 'Charlie Lee' },
    { id: 4, name: 'Diana King' },
    { id: 5, name: 'Ethan Brown' },
];

const staff = [
    { id: 1, name: 'Dr. Green', team: [] },
    { id: 2, name: 'Prof. Blue', team: [] },
];

export default function AdminInternships() {
    const { t } = useTranslation();
    const [internships] = useState(initialInternships);
    const [staffTeams, setStaffTeams] = useState(staff);
    const [selected, setSelected] = useState({});
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const handleAssign = (internshipId, staffId) => {
        const studentIds = selected[internshipId]?.students || [];
        const staffMember = staffTeams.find((s) => s.id === staffId);

        setStaffTeams((prev) =>
            prev.map((s) =>
                s.id === staffId ? { ...s, team: [...s.team, ...studentIds.filter((id) => !s.team.includes(id))] } : s
            )
        );
        setSelected((sel) => ({ ...sel, [internshipId]: { students: [], staff: staffId } }));

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: t('adminDashboard.internshipAssignments.assignmentSuccess', {
                count: studentIds.length,
                staffName: staffMember?.name,
            }),
        });

        // Hide notification after 3 seconds
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
    };

    return (
        <div>
            <h2 className="form-title">{t('adminDashboard.internshipAssignments.title')}</h2>

            {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            <div className="admin-panel">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <h3>{t('adminDashboard.internshipAssignments.approvedInternships')}</h3>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('adminDashboard.internshipAssignments.internshipTitle')}</th>
                            <th>{t('adminDashboard.internshipAssignments.description')}</th>
                            <th>{t('adminDashboard.internshipAssignments.approvedStudents')}</th>
                            <th>{t('adminDashboard.internshipAssignments.staffAssignment')}</th>
                            <th>{t('adminDashboard.internshipAssignments.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {internships.map((internship) => (
                            <tr key={internship.id}>
                                <td>
                                    <strong>{internship.title}</strong>
                                </td>
                                <td>{internship.description}</td>
                                <td>
                                    <div className="student-selection">
                                        {internship.approvedStudents.map((sid) => (
                                            <label key={sid} className="student-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={selected[internship.id]?.students?.includes(sid) || false}
                                                    onChange={(e) => {
                                                        setSelected((sel) => {
                                                            const prev = sel[internship.id]?.students || [];
                                                            return {
                                                                ...sel,
                                                                [internship.id]: {
                                                                    ...sel[internship.id],
                                                                    students: e.target.checked
                                                                        ? [...prev, sid]
                                                                        : prev.filter((id) => id !== sid),
                                                                    staff: sel[internship.id]?.staff || '',
                                                                },
                                                            };
                                                        });
                                                    }}
                                                />
                                                {students.find((s) => s.id === sid)?.name}
                                            </label>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <select
                                        className="input-select"
                                        value={selected[internship.id]?.staff || ''}
                                        onChange={(e) =>
                                            setSelected((sel) => ({
                                                ...sel,
                                                [internship.id]: {
                                                    ...sel[internship.id],
                                                    staff: Number(e.target.value),
                                                },
                                            }))
                                        }
                                    >
                                        <option value="">
                                            {t('adminDashboard.internshipAssignments.selectStaff')}
                                        </option>
                                        {staffTeams.map((st) => (
                                            <option key={st.id} value={st.id}>
                                                {st.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="form-button form-button-sm form-button-compact"
                                        disabled={
                                            !selected[internship.id]?.staff ||
                                            !selected[internship.id]?.students?.length
                                        }
                                        onClick={() => handleAssign(internship.id, selected[internship.id].staff)}
                                    >
                                        {t('adminDashboard.internshipAssignments.assign')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="admin-panel">
                <h3>{t('adminDashboard.internshipAssignments.staffTeams')}</h3>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('adminDashboard.internshipAssignments.staffMember')}</th>
                            <th>{t('adminDashboard.internshipAssignments.teamMembers')}</th>
                            <th>{t('adminDashboard.internshipAssignments.teamSize')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffTeams.map((st) => (
                            <tr key={st.id}>
                                <td>
                                    <strong>{st.name}</strong>
                                </td>
                                <td>
                                    <div className="team-members">
                                        {st.team.length === 0 ? (
                                            <span className="no-members">
                                                {t('adminDashboard.internshipAssignments.noStudentsAssigned')}
                                            </span>
                                        ) : (
                                            st.team.map((sid) => (
                                                <span key={sid} className="team-member-badge">
                                                    {students.find((s) => s.id === sid)?.name}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span className="team-size-badge">
                                        {st.team.length}{' '}
                                        {st.team.length !== 1
                                            ? t('adminDashboard.internshipAssignments.students')
                                            : t('adminDashboard.internshipAssignments.student')}
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
