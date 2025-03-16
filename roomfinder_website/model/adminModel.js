


export default class AdminModel {

    // login
    static login(email, password) {

        const loginData = {
            email: email,
            password: password
        };  

        return fetch('http://localhost/RoomFinder_API/api/index.php/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);     
            return data;
        })
        .catch(error => {
            console.error('Error during login:', error);
            throw error;
        });
    }

    // add web specific users route (auth page)
    static addUser(role, username, email, password) {

        const userData = {
            role: role,
            username: username,
            email: email,
            password: password
        };

        console.log("SignUp data being sent:", userData);

        return fetch('http://localhost/RoomFinder_API/api/index.php/admin/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('User Added:', data);
            return data;
        })
        .catch(error => {
            console.error('Error adding user:', error);
            throw error;
        });
    }
}
