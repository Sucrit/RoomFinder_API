
// auto load in index.js
// profile view dom/M
export function updateProfile() {

    const username = localStorage.getItem('username') || 'Unknown User'; 
    const role = localStorage.getItem('role') || 'Unknown Role'; 
    const profilepic = localStorage.getItem('profilepic') || '../roomfinder_website/assets/images/web-svg-icons/profile-default.svg';

    const profileNameElement = document.getElementsByClassName('profileName')[0];
    const profileRoleElement = document.getElementsByClassName('profileRole')[0];
    const profilePicElement = document.getElementsByClassName('profilePic')[0];

    if (profilePicElement) {
        profilePicElement.src = profilepic;
    }
    // set text content to profile dom
    if (profileNameElement) {
        profileNameElement.textContent = username;
    }
    if (profileRoleElement) {
        profileRoleElement.textContent = role;
    }
    else {
        console.error('element not found');
    }
}
