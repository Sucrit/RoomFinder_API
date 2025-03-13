document.addEventListener('DOMContentLoaded', function () {
    const profileNameElement = document.getElementsByClassName('profileName');
    const profileRoleElement = document.getElementsByClassName('profileRole');

    // Retrieve username and role from localStorage
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    // Update profile info in DOM if elements exist
    if (profileNameElement && username) {
        profileNameElement.textContent = username;
    } else {
        console.error('Element with id "profileName" not found or username not found.');
    }

    if (profileRoleElement && role) {
        profileRoleElement.textContent = role;
    } else {
        console.error('Element with id "profileRole" not found or role not found.');
    }
});
