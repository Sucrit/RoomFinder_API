
import AdminModel from '../model/adminModel.js';  

export default class AdminViewModel {

    // login page
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
                    const email = admin.email || 'Unknown Email';
                    const id = admin.id || 'Unknown ID';

                    // save info to local storage
                    localStorage.setItem('authToken', response.token);
                    console.log('Viewmodel auth token:', response.token);
                    localStorage.setItem('username', username); 
                    localStorage.setItem('role', role);
                    localStorage.setItem('email', email);
                    localStorage.setItem('id', id);

                    return { status: 'success', username, role, email, id };
                } else {
                    return { status: 'error', message: response.message || 'Login failed' };
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                return { status: 'error', message: error.message || 'Error occurred while logging in' };
            });
    }


    // add web users form (auth section)
    static async handleSignUp(role, username, email, password, teacher_id) {
        try {
            const result = await AdminModel.addUser(role, username, email, password, teacher_id);
 
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

    
    // get all authenticated users (auth section)
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


    // delete admin (auth section)
    static async deleteAdmin(adminId) {
        try {
            const response = await AdminModel.deleteAdmins(adminId); 
            if (response && response.message === 'Admin deleted successfully') {
                return { success: true, message: 'Admin deleted successfully' };
            } else {
                return { success: false, message: 'Failed to delete admin' };
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
            return { success: false, message: 'Error deleting admin' };
        }
    }


    // delete user (auth section)
    static async deleteUser(userId) {
        try {
            const response = await AdminModel.deleteUsers(userId);  
            if (response && response.message === 'User deleted successfully') {
                return { success: true, message: 'User deleted successfully' };
            } else {
                return { success: false, message: 'Failed to delete user' };
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            return { success: false, message: 'Error deleting user' };
        }
    }  

    // update password
    static async updatePassword(adminId, oldPassword, newPassword, confirmPassword) {
        try {
            const response = await AdminModel.updatePasswordById(adminId, oldPassword, newPassword, confirmPassword);
    
            if (response && response.success) {
                return { status: 'success', message: 'Password updated successfully' };
            } else {
                return { status: 'error', message: response.message || 'Failed to update password' };
            }
        } catch (error) {
            console.error('Error updating password:', error);
            return { status: 'error', message: 'Error updating password' };
        }
    }


    // logout
    static async logoutUser() {
        try {
            const authToken = localStorage.getItem('authToken');  // Get the token first
            console.log('Auth Token:', authToken);
            if (!authToken) {
                throw new Error('No authentication token found');  // Ensure token is available
            }
    
            const response = await AdminModel.logout(authToken); // Pass token explicitly if necessary
    
            // Remove the local storage items only after the request is successful
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('email');
            localStorage.removeItem('id');
    
            if (response && response.message) {
                return { status: 'success', message: response.message };
            }
            return { status: 'success', message: 'Logged out successfully' };
        } catch (error) {
            // Remove items even in case of error to ensure proper cleanup
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('email');
            localStorage.removeItem('id');
    
            console.error('Error during logout:', error);
            return { 
                status: 'error', 
                message: error.message || 'Error occurred during logout' 
            };
        }
    }    
}
