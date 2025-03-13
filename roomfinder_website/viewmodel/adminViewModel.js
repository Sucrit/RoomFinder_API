class AdminViewModel {
    constructor() {
        this.email = '';
        this.password = '';
    }

    loginUser() {
        if (!this.email || !this.password) {
            return { status: 'error', message: 'Email and password are required' };
        }

        return AdminModel.login(this.email, this.password)
            .then(response => {
                console.log('Response from API:', response);  // Log the response to check

                if (response.message === 'Login successful!') {
                    const admin = response.admin;  // Access admin object
                    const username = admin.username || 'Default User';  // Default value in case it's missing
                    const role = admin.role || 'Default Role';  // Default value in case it's missing

                    // Update profile and store in localStorage
                    this.updateProfile(username, role);
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('username', username);  // Store username
                    localStorage.setItem('role', role);          // Store role

                    // Redirect to home page
                    window.location.href = 'home.html';
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
        const profileNameElement = document.getElementById('profileName');
        const profileRoleElement = document.getElementById('profileRole');

        if (profileNameElement) {
            profileNameElement.textContent = username;
        } else {
            console.error('Element with id "profileName" not found.');
        }

        if (profileRoleElement) {
            profileRoleElement.textContent = role;
        } else {
            console.error('Element with id "profileRole" not found.');
        }
    }

    setEmail(email) {
        this.email = email;
    }

    setPassword(password) {
        this.password = password;
    }
}
