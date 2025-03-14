

// VIEW JS

import AdminViewModel from '/roomfinder_website/viewmodel/adminViewModel.js'; 

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();  

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        console.log(email, password, username, role);   

        const adminViewModel = new AdminViewModel();

        
        // Log the view model before setting values (this should be empty)
        console.log('Before setting email and password:', adminViewModel);

        adminViewModel.setEmail(email);
        adminViewModel.setPassword(password);

        adminViewModel.loginUser()
            .then(result => {
                if (result.status === 'success') {
                    console.log('Login successful');

                    if (!localStorage.getItem('username') || !localStorage.getItem('role')) {
                        localStorage.setItem('username', adminViewModel.username);
                        localStorage.setItem('role', adminViewModel.role);
                    }

                } else {
                    console.error('Login failed:', result.message);
                    document.getElementById('error-message').textContent = result.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
