

// SECTION ROUTE HANDLER AND VIEW SECTION JS   

import RoomViewModel from '/roomfinder_website/viewmodel/roomViewModel.js'; 
import RoomRequestViewModel from '/roomfinder_website/viewmodel/roomrequestViewModel.js';

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

                    if (profilePlaceholder) {
                        profilePlaceholder.innerHTML = profileContent;
    
                        // get name and role from local storage
                        const username = localStorage.getItem('username');
                        const role = localStorage.getItem('role');
    
                        // update the profile div with the username and role
                        if (username && role) {
                            const profileNameElement = document.querySelector('.profileName');
                            const profileRoleElement = document.querySelector('.profileRole');
    
                            // update profile name and role text 
                            if (profileNameElement) {
                                profileNameElement.textContent = username;
                            }
                            if (profileRoleElement) {
                                profileRoleElement.textContent = role;
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error loading profile:', error);
                });
                
            // remove hidden class from the section once access
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.remove('hidden');

                // execute section-specific logic
                if (sectionId === 'dashboard') {
                    RoomRequestViewModel.loadRoomRequests();
                }
                else if (sectionId === 'pending_request') {
                    RoomRequestViewModel.loadPendingRequests();
                }
                else if (sectionId === 'request_history') {
                    RoomRequestViewModel.loadRequestHistory();
                }
                else if (sectionId === 'room') {
                    const roomViewModel = new RoomViewModel();  
                    console.log('RoomViewModel:', roomViewModel);
                    roomViewModel.loadRooms();
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

