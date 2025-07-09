const API_URL = 'http://localhost:3001/api/appointment';

export async function fetchStudentAppointments() {
    const response = await fetch(`${API_URL}/student`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch student appointments');
    }
    return response.json();
}

export function getAppointmentQrCodeUrl(QRcode_ID) {
    if (!QRcode_ID) return null;
    return `http://localhost:3001/qrcodes/${QRcode_ID}.png`;
} 