function togglePassword() {
    var passwordInput = document.getElementById("password");
    var eyeIcon = document.querySelector(".eye-icon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.innerHTML = `<path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-7 0-11-7-11-7a17.31 17.31 0 0 1 3.2-3.82M9.88 9.88a3 3 0 1 1 4.24 4.24M21 21l-4.35-4.35M2 2l20 20" />`;
    } else {
        passwordInput.type = "password";
        eyeIcon.innerHTML = `<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
                             <circle cx="12" cy="12" r="3"></circle>`;
    }
}


function validateLogin(event) {
    event.preventDefault(); 

    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();
    var errorMessage = document.getElementById("error-message");
    var successModal = document.getElementById("successModal");

    errorMessage.textContent = "";

    if (username === "" || password === "") {
        errorMessage.textContent = "Please enter both username and password.";
        errorMessage.style.color = "red";
        return;
    }

    if (username === "admin" && password === "1234") {
        successModal.style.display = "block";

        setTimeout(function () {
            window.location.href = "home.html"; 
        }, 2000); 
    } else {
        errorMessage.textContent = "Invalid username or password. Please try again.";
        errorMessage.style.color = "red";
    }
}

function closeModal() {
    document.getElementById("successModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".login-form").addEventListener("submit", validateLogin);
});

