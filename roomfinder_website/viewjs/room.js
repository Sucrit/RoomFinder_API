
// room section dom/M
import RoomViewModel from '../viewmodel/roomViewModel.js';

export function InitRoomsSection() {
    const roomListBody = document.getElementById('roomListBody');
    const filter = document.querySelector('.filter');
    const searchBar = document.querySelector('.search-bar');

    // reset table 
    roomListBody.innerHTML = '';
    RoomViewModel.getAllRooms()
        .then(result => {
            if (result.success) {
                const rooms = result.rooms;
                if (rooms.length > 0) {
                    // rows each room
                    rooms.forEach(room => {
                        const row = document.createElement('tr');
                        row.classList.add('room-item');
                        row.innerHTML = `
                            <td>${room.room_building}</td>
                            <td>${room.room_number}</td>
                            <td>${room.room_schedule || 'fix my api response'}</td>
                            <td><span class="status ${getStatusClass(room.status)}">${room.status}</span></td>
                            <td><button class="remove-btn" data-room-id="${room.id}">Remove</button></td>

                            <!-- <td><button class="update-btn" data-room-id="${room.id}">Update</button></td> -->
                        `;
                        roomListBody.appendChild(row);

                        // remove btn event listener
                        const removeBtn = row.querySelector('.remove-btn');
                        removeBtn.addEventListener('click', () => {
                            const roomId = removeBtn.getAttribute('data-room-id');

                            row.remove();
                            RoomViewModel.deleteRoom(roomId)  
                                .then(response => {
                                    if (!response.success) {
                                        alert(response.message)
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

    function getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'available':
                return 'available';
            case 'occupied':
                return 'occupied';
            case 'maintenance':
                return 'closed';
            default:
                return '';
        }
    }
    // track role, searchtxt value
    let selectedStatus = 'all';  
    let searchText = '';        

    // event listener
    filter.addEventListener('change', function () {
        selectedStatus = filter.value; 
        filterTable(); 
    });
    searchBar.addEventListener('input', function () {
        searchText = searchBar.value.toLowerCase(); 
        filterTable(); 
    });

    // filter
    function filterTable() {
        const rows = roomListBody.querySelectorAll('tr'); 
        rows.forEach(row => {
            const statusCell = row.cells[3];  
            const buildingCell = row.cells[0];  
            const roomNumberCell = row.cells[1]; 

            const roomStatus = statusCell ? statusCell.textContent.toLowerCase() : '';
            const roomBuilding = buildingCell ? buildingCell.textContent.toLowerCase() : '';
            const roomNumber = roomNumberCell ? roomNumberCell.textContent.toLowerCase() : '';

            const statusMatches = selectedStatus === 'all' || roomStatus === selectedStatus.toLowerCase();

            const searchMatches = roomBuilding.includes(searchText) || roomNumber.includes(searchText) || roomStatus.includes(searchText);

            if (statusMatches && searchMatches) {
                row.style.display = '';  
            } else {
                row.style.display = 'none'; 
            }
        });
    }
}
