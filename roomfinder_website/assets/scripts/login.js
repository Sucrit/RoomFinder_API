

// LOGIN VIEW JS

import AdminViewModel from '/roomfinder_website/viewmodel/adminViewModel.js'; 

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();  

        // get email and password from form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const adminViewModel = new AdminViewModel();

        // set email and password in view model
        adminViewModel.setEmail(email);
        adminViewModel.setPassword(password);

        adminViewModel.loginUser()
            .then(result => {
                if (result.status === 'success') {
                    console.log('Login successful');

                    // save username and role in local storage if not already set
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
