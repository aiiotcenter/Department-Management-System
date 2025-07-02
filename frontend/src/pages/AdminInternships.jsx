import { useState } from 'react';
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
    const [internships] = useState(initialInternships);
    const [staffTeams, setStaffTeams] = useState(staff);
    const [selected, setSelected] = useState({});

    const handleAssign = (internshipId, staffId) => {
        const studentIds = selected[internshipId]?.students || [];
        setStaffTeams((prev) =>
            prev.map((s) =>
                s.id === staffId ? { ...s, team: [...s.team, ...studentIds.filter((id) => !s.team.includes(id))] } : s
            )
        );
        setSelected((sel) => ({ ...sel, [internshipId]: { students: [], staff: staffId } }));
    };

    return (
        <div className="admin-internships-container">
            <h2>Approved Internships</h2>
            {internships.map((internship) => (
                <div key={internship.id} className="admin-internship-card">
                    <h3>{internship.title}</h3>
                    <p>{internship.description}</p>
                    <div>
                        <strong>Approved Students:</strong>
                        <ul>
                            {internship.approvedStudents.map((sid) => (
                                <li key={sid}>
                                    <label>
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
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <strong>Assign to Staff:</strong>
                        <select
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
                            <option value="">Select Staff</option>
                            {staffTeams.map((st) => (
                                <option key={st.id} value={st.id}>
                                    {st.name}
                                </option>
                            ))}
                        </select>
                        <button
                            disabled={!selected[internship.id]?.staff || !selected[internship.id]?.students?.length}
                            onClick={() => handleAssign(internship.id, selected[internship.id].staff)}
                        >
                            Assign to Team
                        </button>
                    </div>
                </div>
            ))}
            <div className="admin-internships-teams">
                <h2>Staff Teams</h2>
                {staffTeams.map((st) => (
                    <div key={st.id} className="team-card">
                        <strong>{st.name}'s Team:</strong>
                        <ul>
                            {st.team.length === 0 && <li>No students assigned yet.</li>}
                            {st.team.map((sid) => (
                                <li key={sid}>{students.find((s) => s.id === sid)?.name}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
