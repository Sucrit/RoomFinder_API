


import AdminModel from '../model/adminModel.js';  


export default class AdminViewModel {

    constructor() {
        this.username = localStorage.getItem('username') || '';
        this.role = localStorage.getItem('role') || '';
    }

    loginUser() {
        if (!this.email || !this.password) {
            return { status: 'error', message: 'Email and password are required' };
        }

        return AdminModel.login(this.email, this.password)
            .then(response => {
                if (response.message === 'Login successful!' && response.admin) {

                const admin = response.admin;
                this.   username = admin.username || 'Default User';
                this.role = admin.role || 'Default Role';

                // save info in local storage
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('username', this.username); 
                localStorage.setItem('role', this.role); 


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

    // updateProfile(username, role) {
    //     const profileNameElement = document.getElementsByClassName('profileName')[0];
    //     const profileRoleElement = document.getElementsByClassName('profileRole')[0];

    //     if (profileNameElement) {
    //         profileNameElement.textContent = username;
    //     } else {
    //         console.error('Element with class "profileName" not found.');
    //     }

    //     if (profileRoleElement) {
    //         profileRoleElement.textContent = role;
    //     } else {
    //         console.error('Element with class "profileRole" not found.');
    //     }
    // }

    setEmail(email) {
        this.email = email;
    }

    setPassword(password) {
        this.password = password;
    }
}
