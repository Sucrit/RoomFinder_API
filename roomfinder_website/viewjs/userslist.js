
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
                    // rows each users
                    users.forEach(user => {
                        const row = document.createElement('tr');
                        row.classList.add('user-item');

                        row.innerHTML = `
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>${user.teacher_id || 'N/A'}</td>
                            <td>
                                <button class="remove-btn"
                                    data-user-id="${user.id}" 
                                    data-role="${user.role}">Remove</button>
                            </td>
                        `;
                        userListBody.appendChild(row);

                        // remove btn event lstener
                        const removeBtn = row.querySelector('.remove-btn');
                        removeBtn.addEventListener('click', () => {
                            const userId = removeBtn.getAttribute('data-user-id');
                            const userRole = removeBtn.getAttribute('data-role');
                            
                            row.remove();
                            // separate deletion by role
                            if (userRole === 'admin') {
                                AdminViewModel.deleteAdmin(userId)  
                                    .then(response => {
                                        if (!response.success) {
                                            alert(response.message)
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error deleting admin:', error);
                                        alert('Failed to delete admin');
                                    });
                            } else {
                                console.log('Attempting to delete user with ID:', userId);
                                AdminViewModel.deleteUser(userId) 
                                    .then(response => {
                                        if (response.success) {
                                            row.remove();
                                        } else {
                                            alert(response.message);
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error deleting user:', error);
                                        alert('Failed to delete user');
                                    });
                            }
                        });
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
            userListBody.innerHTML = `<tr><td colspan="5">Failed to load users.</td></tr>`;
        });


    // track role, searchtxt value
    let selectedRole = 'all';
    let searchText = '';

    // event listeners
    filter.addEventListener('change', function() {
        selectedRole = filter.value; 
        filterTable(); 
    });
    searchBar.addEventListener('input', function() {
        searchText = searchBar.value.toLowerCase();  
        filterTable(); 
    });

    
    // filter
    function filterTable() {
        const rows = userListBody.querySelectorAll('tr');
        rows.forEach(row => {
            const roleCell = row.cells[2]; 
            const usernameCell = row.cells[0]; 
            const emailCell = row.cells[1];    
            const teacherIdCell = row.cells[3];

            const userRole = roleCell ? roleCell.textContent.toLowerCase() : '';
            const username = usernameCell ? usernameCell.textContent.toLowerCase() : '';
            const email = emailCell ? emailCell.textContent.toLowerCase() : '';
            const teacherId = teacherIdCell ? teacherIdCell.textContent.toLowerCase() : '';

            const roleMatches = selectedRole === 'all' || userRole === selectedRole.toLowerCase();
            const searchMatches = username.includes(searchText) || email.includes(searchText) || teacherId.includes(searchText);

            if (roleMatches && searchMatches) {
                row.style.display = ''; 
            } else {
                row.style.display = 'none';  
            }
        });
    }
}
