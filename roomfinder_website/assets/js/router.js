function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll('main section').forEach(section => {
        section.classList.add('hidden');
    });

    // Try to fetch the content of the requested section
    fetch(`./view/${sectionId}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Section file not found: ${sectionId}`);
            }
            return response.text();
        })
        .then(content => {
            const mainContent = document.getElementById('content');
            mainContent.innerHTML = content;  // Load content into the <main> section

            // Show the requested section
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.remove('hidden');
            } else {
                console.error(`Section with ID '${sectionId}' not found in the loaded content.`);
            }
        })
        .catch(error => {
            console.error(`Error loading section: ${error.message}`);
            document.getElementById('content').innerHTML = `<p>Sorry, an error occurred while loading the section.</p>`;
        });

    // Update active link in the navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Set active class on the correct link
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.innerText.trim() === sectionId) {
            item.classList.add('active');
        }
    });
}
