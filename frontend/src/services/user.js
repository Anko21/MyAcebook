const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export async function getUserById(id) {
    const response = await fetch(`${BACKEND_URL}/users/${id}`);
    const data = await response.json();
    return data;
}

async function updateUser(id, updatedUserData) {
    const response = await fetch(`${BACKEND_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUserData)
    });
    const data = await response.json();
    return data;
}

export default {
    updateUser
};