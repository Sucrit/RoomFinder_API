import AdminViewModel from '/roomfinder_website/viewmodel/adminViewModel.js'; 

window.initializeAddUserForm = function() {
    console.log("Script adduser.js loaded");

    const signUpForm = document.getElementById('signUpForm');
    console.log("Form found:", signUpForm);

    // form event listener
    signUpForm.addEventListener('submit', async function(event) {
        event.preventDefault();  

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('ConfirmPassword').value;
        const role = document.getElementById('role').value;

        console.log('Form submitted with data:', {role, username, email, password, confirmPassword });

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return; // Prevent form submission if passwords don't match
        }

        // If passwords match, proceed to handle sign-up
        try {
            const result = await AdminViewModel.handleSignUp(role, username, email, password);
            console.log('SignUp Result:', result);  // Log the result here

            if (result.success) {
                alert(result.message);  // Success message from the API
            } else {
                alert(result.message || "An error occurred while adding the user");  // Error message or fallback
            }
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert("An error occurred while signing up. Please try again.");
        }
    });
};
