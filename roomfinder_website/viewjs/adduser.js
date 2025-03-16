
import AdminViewModel from '../viewmodel/adminViewModel.js';    

document.addEventListener('DOMContentLoaded', function() {
    window.InitAddUserSection = function() {

        // btn element
        const signUpForm = document.getElementById('signupform');
        const addBtn = document.querySelector('.addBtn');
        const backBtn = document.querySelector('.backBtn');
        const roleSelector = document.getElementById('role');
        const teacherIdContainer = document.getElementById('teacher-id-container');
        const teacherIdInput = document.getElementById('teacherID');

        if (roleSelector.value === 'teacher') {
            teacherIdContainer.style.display = 'block'; 
        } else {
            teacherIdContainer.style.display = 'none'; 
        }

        // show teacher id input
        roleSelector.addEventListener('change', function() {
            const role = roleSelector.value;
            if (role === 'teacher') {
                teacherIdContainer.style.display = 'block'; 
            } else {
                teacherIdContainer.style.display = 'none'; 
            }
        });

        addBtn.addEventListener('click', async function(event) {
            event.preventDefault();

            const role = document.getElementById('role').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('ConfirmPassword').value;
            const teacherId = teacherIdInput ? teacherIdInput.value : ''; 

            if (!role || !username || !email || !password || !confirmPassword || (role === 'teacher' && !teacherId)) {
                alert('Please fill out all fields!');
                return;
            }

            // check password match
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            // signup
            try {
                const result = await AdminViewModel.handleSignUp(role, username, email, password, teacherId);
                console.log('User added with data:', result);

                if (result.success) {
                    alert(result.message);
                    signUpForm.reset();
                } else {
                    alert(result.message || "Cannot get message response from API");
                }
            } catch (error) {
                console.error("Error during sign-up:", error);
                alert("An error occurred while signing up. Please try again.");
            }
        });

        // back button
        backBtn.addEventListener('click', function(event) {
            event.preventDefault();
            showSection('dashboard');
        });
    };
});
