
import { updateProfile } from '../viewjs/profile.js';
import AdminModel from '../model/adminModel.js';  

export default class AdminViewModel {

    // Static login function
    static loginUser(email, password) {
        if (!email || !password) {
            return { status: 'error', message: 'Email and password are required' };
        }

        return AdminModel.login(email, password)
            .then(response => {
                if (response.message === 'Login successful!' && response.admin) {
                    const admin = response.admin;
                    const username = admin.username || 'Unknown User';
                    const role = admin.role || 'Unknown Role'; 

                    // Save info in local storage
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('username', username); 
                    localStorage.setItem('role', role);

                    return { status: 'success', username, role };
                } else {
                    return { status: 'error', message: response.message || 'Login failed' };
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                return { status: 'error', message: error.message || 'Error occurred while logging in' };
            });
    }

    // Setters for email and password (optional)
     setEmail(email) {
        this.email = email;
    }

     setPassword(password) {
        this.password = password;
    }


    // add web users form (auth page)
    static async handleSignUp(role, username, email, password, teacher_id) {
        try {
            const result = await AdminModel.addUser(role, username, email, password, teacher_id);
            // check msg response from api
            if (result && result.message) {
                return { success: true, message: result.message };
            } else {
                return { success: false, message: 'An error occurred while adding the user' };
            }
        } catch (error) {
            console.error('Error adding user:', error);
            return { success: false, message: 'Error adding user' };
        }
    } 

    
    // get all authenticated users
    static async getAllUsers() {
        try {
            const response = await AdminModel.getUsers();
    
            if (response && response['All Users']) {
                return { success: true, users: response['All Users'] };
            } else {
                return { success: false, message: 'No users found in the response' };
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            return { success: false, message: 'Error fetching users' };
        }
    }

}
