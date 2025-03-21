// room section DOM/M
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

    let selectedStatus = 'all';
    let searchText = '';

    // init event listeners
    function initEventListeners() {
        // event listeners 
        filter.addEventListener('change', () => { selectedStatus = filter.value; filterTable(); });
        searchBar.addEventListener('input', () => { searchText = searchBar.value.toLowerCase(); filterTable(); });
        floatingBtn.addEventListener('click', openAddRoomModal);
        addRoomForm.addEventListener('submit', handleAddRoom);
        addCloseBtn.addEventListener('click', closeAddRoomModal);
        window.addEventListener('click', (event) => { if (event.target === addModal) closeAddRoomModal(); });
    }

    // modal
    function openAddRoomModal() { addModal.style.display = 'block'; }
    function closeAddRoomModal() { addModal.style.display = 'none'; }

    // Fetch rooms and render
    function fetchRooms() {
        roomListBody.innerHTML = '';
        RoomViewModel.getAllRooms()
            .then(result => {
                if (result.success && result.rooms.length > 0) {
                    renderRoomRows(result.rooms);
                } else {
                    roomListBody.innerHTML = `<tr><td colspan="5">${result.message || 'No rooms available'}</td></tr>`;
                }
            })
            .catch(error => {
                console.error('Error loading rooms:', error);
                roomListBody.innerHTML = `<tr><td colspan="5">Error loading rooms</td></tr>`;
            });
    }

    // Render each room's row in the table
    function renderRoomRows(rooms) {
        rooms.forEach(room => {
            const row = document.createElement('tr');
            row.classList.add('room-item');
            row.innerHTML = `
                <td>${room.room_building}</td>
                <td>${room.room_number}</td>
                <td>${room['ongoing schedule'] ? `${room['ongoing schedule'].starting_time} - ${room['ongoing schedule'].ending_time}` : 'N/A'}</td>
                <td>${room.status}</td>
                <td>
                    <button class="remove-btn" data-room-id="${room.id}">Remove</button>
                    <button class="update-btn" data-room-id="${room.id}">Update</button>
                </td>
            `;
            roomListBody.appendChild(row);

            // btn eventlisteners
            row.querySelector('.remove-btn').addEventListener('click', () => handleRemoveRoom(room.id, row));
            row.querySelector('.update-btn').addEventListener('click', () => handleUpdateRoom(room.id));
        });
    }

    // remove room helper
    function handleRemoveRoom(roomId, row) {
        showToast('Are you sure you want to remove this room?', 'info', {
            showButtons: true,
            onConfirm: () => {
                row.classList.add('ud-button-animation');
                setTimeout(() => {
                    row.remove();
                    removeRoom(roomId);
                }, 250);
            },
            onCancel: () => { showToast('Room removal canceled', 'info'); }
        });
    }

    // remove room 
    function removeRoom(roomId) {
        RoomViewModel.deleteRoom(roomId)
            .then(response => {
                if (response.success) {
                    showToast('Room removed successfully', 'success');
                } else {
                    showToast('Failed to remove room', 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting room:', error);
                showToast('Failed to delete room', 'error');
            });
    }

    // Handle room update (placeholder function)
    // function handleUpdateRoom(roomId) {
    //     // Add room update logic here
    //     console.log(`Update room with ID: ${roomId}`);
    // }

    // filter room via status and text value
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

            row.style.display = (statusMatches && searchMatches) ? '' : 'none';
        });
    }

    // create room
    async function handleAddRoom(event) {
        event.preventDefault();

        const roomData = getRoomDataFromForm();
        try {
            const result = await RoomViewModel.createRoom(roomData);
            if (result.success) {
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

    // get values from forms (html)
    function getRoomDataFromForm() {
        const roomBuilding = document.querySelector('select[name="roomBuilding"]').value;
        const roomNumber = document.querySelector('input[name="roomNumber"]').value;
        const capacity = document.querySelector('input[name="capacity"]').value;
        const roomType = document.querySelector('select[name="roomType"]').value;
        const availability = document.querySelector('select[name="availability"]').value;
        const equipment = Array.from(document.querySelectorAll('.equipment input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value)
            .join(', ');

        return {
            room_building: roomBuilding,
            room_number: roomNumber,
            status: availability,
            equipment: equipment,
            capacity: capacity,
            room_type: roomType
        };
    }

    // init
    function init() {
        initEventListeners();
        fetchRooms();
    }

    // init all
    init();
}
