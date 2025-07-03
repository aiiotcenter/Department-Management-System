// src/services/auth.js

export async function logout() {
    const response = await fetch('http://localhost:3001/api/logout', {
        method: 'POST',
        credentials: 'include', // Important: send cookies
    });
    if (!response.ok) {
        throw new Error('Logout failed');
    }
    return response.json();
}

export async function login(email, password) {
    const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Login failed');
    }
    return result;
}

export async function register({ firstName, lastName, email, password, photo }) {
    let photo_path = '';
    if (photo && photo.length > 0) {
        photo_path = photo[0].name;
    }
    const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            name: `${firstName} ${lastName}`,
            email,
            password,
            photo_path,
        }),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
    }
    return result;
}
