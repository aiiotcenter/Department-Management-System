// src/services/internship.js

const API_URL = 'http://localhost:3001/api';

export async function fetchInternships() {
    try {
        console.log('Fetching internships from:', `${API_URL}/internship_application`);
        const response = await fetch(`${API_URL}/internship_application`, {
            method: 'GET',
            credentials: 'include', // Include cookies for authentication
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch internships:', error);

        // Return mock data for testing when API is not available
        console.log('Using mock internship data for development');
        return [
            {
                User_ID: '07603612',
                User_name: 'Sondos Deeb',
                department: 'Software Engineering',
                period_of_internship: '35 days',
                status: 'Approved',
                additional_notes: 'This is a mock entry for testing',
                university: 'Near East University',
            },
            {
                User_ID: '49091381',
                User_name: 'Jana',
                department: 'Computer Engineering',
                period_of_internship: '25 days',
                status: 'Approved',
                additional_notes: '',
                university: 'Near East University',
            },
        ];
    }
}

export async function updateInternshipStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/internship_application`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ id, status }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to update internship status:', error);
        throw error;
    }
}

export async function fetchStaffUsers() {
    try {
        console.log('Fetching staff users from:', `${API_URL}/admin/staff`);
        const response = await fetch(`${API_URL}/admin/staff`, {
            method: 'GET',
            credentials: 'include',
        });

        console.log('Staff response status:', response.status);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Staff data:', data);

        // Handle the case where the API returns a message instead of an array
        if (Array.isArray(data)) {
            return data;
        } else if (data.message) {
            console.log('API message:', data.message);
            return [];
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch staff users:', error);
        // Return empty array as fallback instead of mock data
        console.log('Returning empty staff array due to error');
        return [];
    }
}

export async function updateInternshipTitle(internshipData) {
    // This is a mock function as the API doesn't support this directly
    // In a real application, you would implement this endpoint on the backend
    console.log('Updating internship title:', internshipData);
    return {
        success: true,
        message: 'Internship title updated successfully',
    };
}
