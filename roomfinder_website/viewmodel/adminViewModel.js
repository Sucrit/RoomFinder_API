

import { updateProfile } from '../assets/scripts/profile.js';
import AdminModel from '../model/adminModel.js';  


export default class AdminViewModel {

   loginUser() {
    if (!this.email || !this.password) {
        return { status: 'error', message: 'Email and password are required' };
    }

    // execute login function from admin model
    return AdminModel.login(this.email, this.password)
        .then(response => {
            if (response.message === 'Login successful!' && response.admin) {
                const admin = response.admin;
                this.username = admin.username || 'Unknown User';
                this.role = admin.role || 'Unknown Role';
                // this.email = admin.email || 'Unknown Email'; 

                // save info in local storage
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('username', this.username); 
                localStorage.setItem('role', this.role);

                // update profile 
                updateProfile(this.username, this.role); 

                window.location.href = '/roomfinder_website/index.html';   
                return { status: 'success', message: 'Login successful!' };
            } else {
                return { status: 'error', message: response.message || 'Login failed' };
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            return { status: 'error', message: error.message || 'Error occurred while logging in' };
        });
    }

    setEmail(email) {
        this.email = email;
    }

    setPassword(password) {
        this.password = password;
    }


    // add user form 
    static async handleSignUp(role, username, email, password) {
        // Call the model to add the user
        try {
            const result = await AdminModel.addUser(role, username, email, password);
            console.log('API Response:', result);  // Log the response from the API
    
            // Check if the API response contains a success message and return it
            if (result && result.message) {
                return { success: true, message: result.message }; // Use the message from the API
            } else {
                return { success: false, message: 'An error occurred while adding the user' };
            }
        } catch (error) {
            console.error('Error adding user:', error);
            return { success: false, message: 'Error adding user' };
        }
    }
    
    
}
