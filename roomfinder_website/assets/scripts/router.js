

// ROUTER AND VIEW SECTION JS

import RoomRequestViewModel from '/roomfinder_website/viewmodel/roomrequestViewModel.js';
import AdminViewModel from '/roomfinder_website/viewmodel/adminViewModel.js';


    window.showSection = function(sectionId) {

    // hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    console.log(sectionId);
    
    // load section content
    fetch(`./view/${sectionId}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Section file not found: ${sectionId}`);
            }
            return response.text();
        })
        .then(content => {
            const mainContent = document.getElementById('content');
            mainContent.innerHTML = content;


            // load profile section
            fetch('./view/profile.html')
                .then(response => response.text())
                
                .then(profileContent => {
                    const profilePlaceholder = document.querySelector('.profile-container');

                    // update profile 
                    if (profilePlaceholder) {
                        profilePlaceholder.innerHTML = profileContent;
    
                        // Get data from localStorage after login and update profile
                        const username = localStorage.getItem('username');
                        const role = localStorage.getItem('role');
    
                        // Update the profile div with the username and role
                        if (username && role) {
                            const profileNameElement = document.querySelector('.profileName');
                            const profileRoleElement = document.querySelector('.profileRole');
                            const profileImgElement = document.getElementById('profileImg');
    
                            // Update profile name and role
                            if (profileNameElement) {
                                profileNameElement.textContent = username;
                            }
                            if (profileRoleElement) {
                                profileRoleElement.textContent = role;
                            }
    
                            // You can update the profile image here if needed
                            // For example, you could add a dynamic image based on role or username
                            if (profileImgElement) {
                                profileImgElement.src = `pic/${username}-profile.jpg`; // Dynamically set profile image
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error loading profile:', error);
                });
                

            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.remove('hidden');

                // execute section-specific logic
                if (sectionId === 'dashboard') {
                    console.log('Loading room requests...');
                    RoomRequestViewModel.loadRoomRequests();
                } else if (sectionId === 'pending_request') {
                    RoomRequestViewModel.loadPendingRequests();
                } else if (sectionId === 'request_history') {
                    RoomRequestViewModel.loadRequestHistory();
                } else if (sectionId === 'rooms') {
                    RoomModel.loadRooms();
                }
            } else {
                console.error(`Section with ID '${sectionId}' not not.`);
            }
        })
        .catch(error => {
            console.error(`Error loading section: ${error.message}`);
            document.getElementById('content').innerHTML = `<p>Error occurred while loading the section.</p>`;
        });

    // update active link in the navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // set active class on the correct link
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.innerText.trim() === sectionId) {
            item.classList.add('active');
        }
    });

}

// default section
window.addEventListener('DOMContentLoaded', () => {
    showSection('dashboard');
});



// toggle dropdown when clicked
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const dropdown = toggle.parentElement;
        dropdown.classList.toggle('open'); 
    });
});

// close dropdown if clicked outside
window.addEventListener('click', function(event) {
    dropdownToggles.forEach(toggle => {
        const dropdown = toggle.parentElement;
        if (!dropdown.contains(event.target) && !toggle.contains(event.target)) {
            dropdown.classList.remove('open');
        }
    });
});


// See all request history button
document.querySelector('.seerequesthistory-btn').addEventListener('click', function() {
    showSection('request_history');
}); 

// See all ongoing schedule button
document.querySelector('.seeongoingschedule-btn').addEventListener('click', function() {
    showSection('ongoing_schedule');
});
// const adminViewModel = new AdminViewModel();

// const username = localStorage.getItem('username');
// const role = localStorage.getItem('role');


// console.log('Username before profile update:', username);
// console.log('Role before profile update:', role);

// adminViewModel.updateProfile(username, role);

