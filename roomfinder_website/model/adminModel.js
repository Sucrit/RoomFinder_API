


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
}
