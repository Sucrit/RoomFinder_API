

// room section dom/M
import RoomViewModel from '../viewmodel/roomViewModel.js';
import { showToast } from './toast.js';

export function InitRoomsSection() {
    const roomListBody = document.getElementById('roomListBody');
    const filter = document.querySelector('.filter');
    const searchBar = document.querySelector('.search-bar');

    const addModal = document.getElementById('modal');
    const floatingBtn = document.querySelector('.floating-btn');
    const addCloseBtn = document.querySelector('#modal .closemodal');
    const addRoomForm = document.querySelector('.roomdetails_form');
    
    // Modal functions
    function openAddRoomModal() {
        addModal.style.display = 'block';  
    }

    function closeAddRoomModal() {
        addModal.style.display = 'none';
    }

    addCloseBtn.onclick = closeAddRoomModal;
    window.onclick = function(event) {
        if (event.target === addModal) {
            closeAddRoomModal();
        }
    }

    function fetchRooms() {
        roomListBody.innerHTML = '';
        
        RoomViewModel.getAllRooms()
        .then(result => {
            if (result.success) {
                const rooms = result.rooms;
                if (rooms.length > 0) {
                    rooms.forEach(room => {
                        const row = document.createElement('tr');
                        row.classList.add('room-item');

                        const ongoingSchedule = room['ongoing schedule'] ? 
                        `${room['ongoing schedule'].starting_time} - ${room['ongoing schedule'].ending_time}` : 
                        'N/A';

                        row.innerHTML = `
                            <td>${room.room_building}</td>
                            <td>${room.room_number}</td>
                            <td>${ongoingSchedule}</td>
                            <td>${room.status}</td>
                            <td>
                                <button class="remove-btn" data-room-id="${room.id}">Remove</button>
                                <button class="update-btn" data-room-id="${room.id}">Update</button>
                            </td>
                        `;
                        roomListBody.appendChild(row);

                            const removeBtn = row.querySelector('.remove-btn');
                            removeBtn.addEventListener('click', () => {
                                const roomId = removeBtn.getAttribute('data-room-id');

                                row.classList.add('ud-button-animation');
                                 
                                setTimeout(() => {
                                    row.remove();
                                    RoomViewModel.deleteRoom(roomId)  
                                        .then(response => {
                                            if (!response.success) {
                                                showToast(response.message);
                                            } else if (response.success) {
                                                showToast(response.message);
                                            }
                                        })
                                        .catch(error => {
                                            console.error('Error deleting room:', error);
                                            alert('Failed to delete room');
                                        });
                                }, 250);
                            });
                        });
                    } else {
                        roomListBody.innerHTML = `<tr><td colspan="5">No rooms available</td></tr>`;
                    }
                } else {
                    roomListBody.innerHTML = `<tr><td colspan="5">Error: ${result.message}</td></tr>`;
                }
            })
            .catch(error => {
                console.error('Error loading rooms:', error);
            });
    }

    // initialize room list
    fetchRooms();


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

    // event listeners for filters
    filter.addEventListener('change', function () {
        selectedStatus = filter.value; 
        filterTable(); 
    });
    searchBar.addEventListener('input', function () {
        searchText = searchBar.value.toLowerCase(); 
        filterTable(); 
    });

    // searchtext rooms
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

    // create room
    async function handleAddRoom(event) {
        event.preventDefault();  

        // room data
        const roomBuilding = document.querySelector('select[name="roomBuilding"]').value;
        const roomNumber = document.querySelector('input[name="roomNumber"]').value;
        const capacity = document.querySelector('input[name="capacity"]').value;
        const roomType = document.querySelector('select[name="roomType"]').value;
        const availability = document.querySelector('select[name="availability"]').value;
        
        // equipment
        const equipmentCheckboxes = document.querySelectorAll('.equipment input[type="checkbox"]:checked');
        const equipment = Array.from(equipmentCheckboxes).map(checkbox => checkbox.value).join(', ');

        const roomData = {
            room_building: roomBuilding,
            room_number: roomNumber,
            status: availability,
            equipment: equipment,
            capacity: capacity,
            room_type: roomType
        };

        try {
            const result = await RoomViewModel.createRoom(roomData);
            if (result.success) {
                alert('Room added successfully!');
                fetchRooms();
                closeAddRoomModal(); 
            } else {
                alert(result.message || 'Error adding room');
            }
        } catch (error) {
            alert('Failed to add room');
            console.error('Error adding room:', error);
        }
    }

    // Attach the handleAddRoom function to the form's submit event
    addRoomForm.addEventListener('submit', handleAddRoom);

    // Re-fetch the room list when the "Add Room" button is clicked
    floatingBtn.addEventListener('click', openAddRoomModal);
}
