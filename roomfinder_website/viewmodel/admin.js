class AdminViewModel {
    constructor() {
        this.email = '';
        this.password = '';
    }

    // Method to handle login logic
    loginUser() {
        if (!this.email || !this.password) {
            return { status: 'error', message: 'Email and password are required' };
        }

        return AdminModel.login(this.email, this.password)
            .then(response => {
                if (response.message === 'Login successful!') {
                    // Successfully logged in - redirect to home.html
                    console.log("Login successful! Redirecting to home.html...");
                    window.location.href = 'home.html'; // You can adjust the path if needed
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

    // Setters to update email and password
    setEmail(email) {
        this.email = email;
    }

    setPassword(password) {
        this.password = password;
    }
}
