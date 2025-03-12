class AdminModel {
    static login(email, password) {
        const loginData = {
            email: email,
            password: password
        };

        console.log('Sending login data:', loginData);  // Debugging line to check what is being sent

        return fetch('http://localhost/RoomFinder_API/api/index.php/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            console.log('Login response status:', response.status);  // Check HTTP status
            return response.json();  // Parse the response
        })
        .then(data => {
            console.log('Login data:', data);  // Log the parsed data

            // Return the parsed response data (no redirect here)
            return data;
        })
        .catch(error => {
            console.error('Error during login:', error);
            throw error;  // Propagate the error
        });
    }
}
