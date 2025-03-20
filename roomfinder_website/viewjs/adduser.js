// adduser.js
import AdminViewModel from '../viewmodel/adminViewModel.js';    

export function InitAddUserSection() {

    // btn element
    const addBtn = document.querySelector('.addBtn');
    const backBtn = document.querySelector('.backBtn');
    const roleSelector = document.getElementById('role');
    const teacherIdContainer = document.getElementById('teacher-id-container');
    const teacherIdInput = document.getElementById('teacherID');

    if (roleSelector.value === 'Teacher') {
        teacherIdContainer.style.display = 'block'; 
    } else {
        teacherIdContainer.style.display = 'none'; 
    }

    // show teacher id input field
    roleSelector.addEventListener('change', function() {
        const role = roleSelector.value;
        if (role === 'Teacher') {
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

        if (role === 'Teacher' && !teacherId) {
            alert('Teacher ID is required!');
            return;
        }

        // check password match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const result = await AdminViewModel.handleSignUp(role, username, email, password, teacherId);
            console.log('User with data in view:', result);

            if (result.success) {
                alert(result.message);

                // reset input field
                document.getElementById('username').value = '';
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
                document.getElementById('ConfirmPassword').value = '';

                // reset teacher id input fld
                if (role === 'Teacher') {
                    teacherIdInput.value = '';
                }
                roleSelector.dispatchEvent(new Event('change'));

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
}
