import { decodeJwt } from '../model/1jwtUtils.js'; 

// Function to get role from the token
export function authorizationRole() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        throw new Error("You are not authorized");
    }

    const { payload } = decodeJwt(authToken); // Decode the JWT

    if (payload.data && payload.data.role) {
        return payload.data.role;  
    } else {
        throw new Error("Role not found in token");
    }
}
