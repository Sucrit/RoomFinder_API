// Function to load a section dynamically by fetching content from the given URL
function loadSection(url) {
    const contentDiv = document.getElementById('content');
    
    // Fetch the content from the specified HTML file
    fetch(url)
        .then(response => response.text())
        .then(data => {
            // Inject the loaded content into the content area
            contentDiv.innerHTML = data;

            // After content is loaded, make sure to call showSection for the initial section
            const sectionId = url.split('/').pop().split('.')[0]; // Extract section name from URL (e.g., "room" from "/view/room.html")
            showSection(sectionId);
        })
        .catch(error => {
            console.error("Error loading the section:", error);
        });
}

// Function to toggle section visibility
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show the requested section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }

    // Remove the 'active' class from all navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add 'active' class to the clicked item
    document.querySelectorAll('.nav-item').forEach(item => {
        const sectionName = item.innerText.trim();
        if (sectionMap[sectionName] === sectionId) {
            item.classList.add('active');
        }
    });
}

// Initialize section visibility on page load
document.addEventListener('DOMContentLoaded', () => {
    showSection('dashboard'); // Default section
});

// Map of sections to their corresponding section IDs
const sectionMap = {
    "Dashboard": "dashboard",
    "Rooms": "rooms",
    "Account": "account",
    "Pending Request": "pending_request",
    "Recent Request": "recent_request",
    "Request History": "request_history",
    "Room Schedules": "room-schedules",
    "On-going Schedule": "ongoing_schedule",
    "Add user": "adduser",
    "List of Users": "userslists"
};

// Add event listeners for navigation items inside DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const sectionName = this.innerText.trim();
            if (sectionMap[sectionName]) {
                showSection(sectionMap[sectionName]);
            }
        });
    });

    // Dropdown toggle functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const dropdown = toggle.parentElement;
            dropdown.classList.toggle('open');
        });
    });

    // Close dropdowns if clicked outside
    window.addEventListener('click', (e) => {
        dropdownToggles.forEach(toggle => {
            const dropdown = toggle.parentElement;
            if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    });
});
