
// PROFILE DIV VIEW JS

// update profile dom elements script
export function updateProfile(username, role) {
    const profileNameElement = document.getElementsByClassName('profileName')[0];
    const profileRoleElement = document.getElementsByClassName('profileRole')[0];

    if (profileNameElement) {
        profileNameElement.textContent = username;
    } else {
        console.error('Element with class "profileName" not found.');
    }

    if (profileRoleElement) {
        profileRoleElement.textContent = role;
    } else {
        console.error('Element with class "profileRole" not found.');
    }
}
