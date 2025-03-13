

import RoomRequestViewModel from '/roomfinder_website/viewmodel/roomrequestViewModel.js';

window.showSection = function(sectionId) {
    // hide all sections
    document.querySelectorAll('main section').forEach(section => {
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

            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.remove('hidden');

                if (sectionId === 'dashboard') {
                    RoomRequestViewModel.loadRoomRequests();  
                } else if (sectionId === 'pending_request') {
                    RoomRequestViewModel.loadPendingRequests(); 
                }
            } else {
                console.error(`Section with ID '${sectionId}' not found in the loaded content.`);
            }
        })
        .catch(error => {
            console.error(`Error loading section: ${error.message}`);
            document.getElementById('content').innerHTML = `<p>Sorry, an error occurred while loading the section.</p>`;
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

// dashboard is the default section to show
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

