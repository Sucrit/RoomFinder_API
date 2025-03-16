
import AdminViewModel from '../viewmodel/adminViewModel.js'; 

export function InitUsersListSection() {
    const userListBody = document.getElementById('userListBody'); 
    const filter = document.querySelector('.filter'); 
    const searchBar = document.querySelector('.search-bar'); 

    // reset table 
    userListBody.innerHTML = '';
    AdminViewModel.getAllUsers()
        .then(result => {
            if (result.success) {
                const users = result.users;
                if (users.length > 0) {
                    // create rows user
                    users.forEach(user => {
                        const row = document.createElement('tr');
                        row.classList.add('user-item');

                        row.innerHTML = `
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>${user.teacher_id || 'N/A'}</td>
                            <td><button class="remove-btn" data-user-id="${user.id}">Remove</button></td>
                        `;
                        userListBody.appendChild(row);
                    });
                } else {
                    userListBody.innerHTML = `<tr><td colspan="5">No users available.</td></tr>`;
                }
            } else {
                userListBody.innerHTML = `<tr><td colspan="5">Error: ${result.message}</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error loading users:', error);
            userListBody.innerHTML = `<tr><td colspan="5">Error loading users.</td></tr>`;
        });

    // filter by role
    filter.addEventListener('change', function() {
        const selectedRole = filter.value;
        filterByRole(selectedRole);
    });

    // filter search bar
    searchBar.addEventListener('input', function() {
        const searchText = searchBar.value.toLowerCase();
        filterBySearchBar(searchText);
    });

    // filter by role function
    function filterByRole(role) {
        const rows = userListBody.querySelectorAll('tr');
        rows.forEach(row => {
            const roleCell = row.cells[2]; 
            const userRole = roleCell ? roleCell.textContent.toLowerCase() : '';
            if (role === 'all' || userRole === role.toLowerCase()) {
                row.style.display = ''; 
            } else {
                row.style.display = 'none'; 
            }
        });
    }

    // filter by search bar function
    function filterBySearchBar(searchText) {
        const rows = userListBody.querySelectorAll('tr');
        rows.forEach(row => {
            const usernameCell = row.cells[0]; 
            const emailCell = row.cells[1]; 
            const teacherIdCell = row.cells[3];
            const username = usernameCell ? usernameCell.textContent.toLowerCase() : '';
            const email = emailCell ? emailCell.textContent.toLowerCase() : '';
            const teacherId = teacherIdCell ? teacherIdCell.textContent.toLowerCase() : '';

            if (username.includes(searchText) || email.includes(searchText) || teacherId.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    
}
