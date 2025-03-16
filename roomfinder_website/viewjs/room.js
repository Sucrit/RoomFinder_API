import RoomViewModel from '../viewmodel/roomViewModel.js';

export function InitRoomsSection() {
    const roomListBody = document.getElementById('roomListBody');
    const filter = document.querySelector('.filter');
    const searchBar = document.querySelector('.search-bar');

    // Reset table
    roomListBody.innerHTML = '';
    RoomViewModel.getAllRooms()
        .then(result => {
            if (result.success) {
                const rooms = result.rooms;
                if (rooms.length > 0) {
                    // Create rows for each room
                    rooms.forEach(room => {
                        const row = document.createElement('tr');
                        row.classList.add('room-item');

                        row.innerHTML = `
                            <td>${room.room_building}</td>
                            <td>${room.room_number}</td>
                            <td>${room.room_schedule || 'Fix API response'}</td>
                            <td>${room.status}</td>
                            <td><button class="remove-btn" data-room-id="${room.id}">Remove</button></td>
                        `;
                        roomListBody.appendChild(row);

                        // Add event listener to remove button
                        const removeBtn = row.querySelector('.remove-btn');
                        removeBtn.addEventListener('click', () => {
                            const roomId = removeBtn.getAttribute('data-room-id');
                            RoomViewModel.deleteRoom(roomId)  // Call deleteRoom in RoomViewModel
                                .then(response => {
                                    if (response.success) {
                                        row.remove();  // Remove the row if deletion was successful
                                    } else {
                                        alert(response.message);  // Alert if deletion fails
                                    }
                                })
                                .catch(error => {
                                    console.error('Error deleting room:', error);
                                    alert('Failed to delete room');
                                });
                        });
                    });
                } else {
                    roomListBody.innerHTML = `<tr><td colspan="5">No rooms available.</td></tr>`;
                }
            } else {
                roomListBody.innerHTML = `<tr><td colspan="5">Error: ${result.message}</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error loading rooms:', error);
            roomListBody.innerHTML = `<tr><td colspan="5">Error loading rooms.</td></tr>`;
        });

    // filter event listeners
    filter.addEventListener('change', function () {
        const selectedStatus = filter.value;
        filterByStatus(selectedStatus);
    });
    searchBar.addEventListener('input', function () {
        const searchText = searchBar.value.toLowerCase();
        filterBySearchBar(searchText);
    });

    // filter functions
    function filterByStatus(status) {
        const rows = roomListBody.querySelectorAll('tr');
        rows.forEach(row => {
            const statusCell = row.cells[3];
            const roomStatus = statusCell ? statusCell.textContent.toLowerCase() : '';
            if (status === 'all' || roomStatus === status.toLowerCase()) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    function filterBySearchBar(searchText) {
        const rows = roomListBody.querySelectorAll('tr');
        rows.forEach(row => {
            const buildingCell = row.cells[0];
            const roomNumberCell = row.cells[1];
            const statusCell = row.cells[3];
            const roomBuilding = buildingCell ? buildingCell.textContent.toLowerCase() : '';
            const roomNumber = roomNumberCell ? roomNumberCell.textContent.toLowerCase() : '';
            const roomStatus = statusCell ? statusCell.textContent.toLowerCase() : '';

            if (roomBuilding.includes(searchText) || roomNumber.includes(searchText) || roomStatus.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}
