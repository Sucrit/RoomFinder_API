document.addEventListener('DOMContentLoaded', () => {
    // Navbar functionality
    const profileContainer = document.querySelector('.profile-container');
    
    const loadProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            const profile = await response.json();
            
            profileContainer.innerHTML = `
                <img src="${profile.image}" class="profile-img">
                <div class="profile-texts">
                    <h3>${profile.name}</h3>
                    <p>${profile.role}</p>
                </div>
            `;
            
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    loadProfile();
});