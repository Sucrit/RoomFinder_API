

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

                // update profile class from profile.js
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
    static handleAddUserForm() {
        const role = document.getElementById('role').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('ConfirmPassword').value;

        // check if pass and confirm pass match
        if (password !== confirmPassword) {
            alert('Passwords does not match!');
            return;
        }

        // add user method
        AdminModel.addUser(role, username, email, password)
            .then(data => {
                if (data.success) {
                    alert('User added successfully!');
                    // Optionally, clear form or navigate
                    document.querySelector('.roleform').reset();
                } else {
                    alert('Failed to add user: ' + data.message);
                }
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    }
}
