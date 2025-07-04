const API_URL = 'http://localhost:3001/api/announcement';

export async function fetchAnnouncements() {
    const response = await fetch(API_URL, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch announcements');
    }
    return response.json();
}

export async function createAnnouncement({ title, content }) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content }),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to create announcement');
    }
    return result;
}

export async function editAnnouncement(id, { title, content }) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content }),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to edit announcement');
    }
    return result;
}
