


export default class AdminModel {

    // login web users route
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
        .then(response => { 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {   
            return data;
        })
        .catch(error => {
            console.error('Error during login:', error);
            throw error;
        });
    }


    // add users route (auth page)
    static addUser(role, username, email, password, teacher_id) {
        const userData = {
            role: role,
            username: username,
            email: email,
            password: password,
            teacher_id: teacher_id
        };

        console.log('teacher added with data:', userData);
    
        return fetch('http://localhost/RoomFinder_API/api/index.php/admin/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('User Added:', data);
            return data;
        })
        .catch(error => {
            console.error('Error adding user:', error);
            throw error;
        });
    }    

    
    // get auth uses list route (auth page)
    static getUsers() {
        return fetch('http://localhost/RoomFinder_API/api/index.php/admin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => { 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('User Added:', data);
            return data;
        })
        .catch(error => {
            console.error('Error adding user:', error);
            throw error;
        });
    }


    // delete admin route
    static deleteAdmins(requestId) {
        return fetch(`http://localhost/RoomFinder_API/api/index.php/admin/${requestId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Admin deleted:', data);
            return data;
        })
        .catch(error => {
            console.error('Error deleting admin:', error.message);
        });
    }

    // delete user route
    static deleteUsers(requestId) {
        return fetch(`http://localhost/RoomFinder_API/api/index.php/user/${requestId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('User deleted:', data);
            return data;
        })
        .catch(error => {
            console.error('Error deleting user:', error.message);
        });
    }

}
