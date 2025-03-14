// viewmodel/adminViewModel.js
import AdminModel from '../model/adminModel.js';  // Import the model to interact with the API

export default class AdminViewModel {
    constructor() {
        this.email = '';
        this.password = '';
        this.username = '';
        this.role = '';
    }

    loginUser() {
        if (!this.email || !this.password) {
            return { status: 'error', message: 'Email and password are required' };
        }

        return AdminModel.login(this.email, this.password)
            .then(response => {
                if (response.message === 'Login successful!') {
                    const admin = response.admin;  
                    console.log('Admin data:', admin)
                    const username = admin.username || 'Default User';  
                    const role = admin.role || 'Default Role'; 

                    // Update profile and store in localStorage
                    this.updateProfile(username, role);
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('username', username);  
                    localStorage.setItem('role', role);         

                    // Redirect to home page (after login)
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

    updateProfile(username, role) {
        const profileNameElement = document.getElementsByClassName('profileName')[0];
        const profileRoleElement = document.getElementsByClassName('profileRole')[0];

        if (profileNameElement) {
            profileNameElement.textContent = username;
        } else {
            console.error('Element with class "profileName" not found.');
        }

        if (profileRoleElement) {
            profileRoleElement.textContent = role;
        } else {
            console.error('Element with class "profileRole" not found.');
        }
    }

    setEmail(email) {
        this.email = email;
    }

    setPassword(password) {
        this.password = password;
    }
}
