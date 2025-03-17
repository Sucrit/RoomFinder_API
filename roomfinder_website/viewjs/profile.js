
// profile view dom/M
export function updateProfile() {

    // get from local storage
    const username = localStorage.getItem('username') || 'Unknown User'; 
    const role = localStorage.getItem('role') || 'Unknown Role'; 

    const profileNameElement = document.getElementsByClassName('profileName')[0];
    const profileRoleElement = document.getElementsByClassName('profileRole')[0];

    // set text content to profile dom
    if (profileNameElement) {
        profileNameElement.textContent = username;
    }
    if (profileRoleElement) {
        profileRoleElement.textContent = role;
    } else {
        console.error('Error: profileRole element not found');
    }
}
