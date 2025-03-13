import AdminViewModel from '/roomfinder_website/viewmodel/adminViewModel.js';  // Adjust the path if needed

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();  // Prevent form submission to allow JS processing

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const adminViewModel = new AdminViewModel();
        adminViewModel.setEmail(email);
        adminViewModel.setPassword(password);

        adminViewModel.loginUser()
            .then(result => {
                if (result.status === 'success') {
                    console.log('Login successful');
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
