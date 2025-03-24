import RoomViewModel from '../viewmodel/roomViewModel.js';
import RoomScheduleViewModel from '../viewmodel/roomscheduleViewModel.js';
import { showToast } from './toast.js';
import { dateTimeFormat } from '../viewjs/timeformat.js';

export function InitRoomsSection() {
    const roomListBody = document.getElementById('roomListBody');
    const filter = document.querySelector('.filter');
    const searchBar = document.querySelector('.search-bar');
    const addModal = document.getElementById('modal');
    const floatingBtn = document.querySelector('.floating-btn');  
    const addCloseBtn = document.querySelector('#modal .closemodal');
    const addRoomForm = document.querySelector('#roomForm');
    
    const addScheduleModal = document.getElementById('addScheduleModal'); 
    const addScheduleForm = addScheduleModal ? addScheduleModal.querySelector('.roomdetails_form') : null; // Form inside Add Schedule modal

    let selectedStatus = 'all';
    let searchText = '';

    // event listeners
    function initEventListeners() {
        filter.addEventListener('change', () => { selectedStatus = filter.value; filterTable(); });
        searchBar.addEventListener('input', () => { searchText = searchBar.value.toLowerCase(); filterTable(); });

        if (floatingBtn) {
            floatingBtn.addEventListener('click', openAddRoomModal);
        } else {
            console.error("Floating button not found!");
        }

        if (addCloseBtn) {
            addCloseBtn.addEventListener('click', closeAddRoomModal);
        }

        window.addEventListener('click', (event) => { 
            if (event.target === addModal) closeAddRoomModal(); 
        });

        if (addRoomForm) {
            addRoomForm.addEventListener('submit', AddRoom);
        } else {
            console.error('Room form not found');
        }

        // create and back btn
        const createBtn = document.querySelector('.createbtn');
        if (createBtn) {
            createBtn.addEventListener('click', AddRoom); 
        }

        const backBtn = document.querySelector('.backbtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                closeAddRoomModal(); 
                resetAddRoomForm();
            });
        } else {
            console.error('Back button not found');
        }

        const addScheduleBtn = document.getElementById('addScheduletoRoom');
        if (addScheduleBtn) {
            addScheduleBtn.addEventListener('click', function() {
                const roomId = addScheduleBtn.getAttribute('data-room-id');
                console.log('Room ID retrieved from button:', roomId);
                closeRoomCreatedModal();
                openAddScheduleModal(roomId);
            });
        } else {
            console.error('Add Schedule button not found');
        }


        // Cancel Add Schedule button
        const cancelAddScheduleBtn = document.getElementById('cancelAddSchedule');
        if (cancelAddScheduleBtn) {
            cancelAddScheduleBtn.addEventListener('click', closeRoomCreatedModal);
        } else {
            console.error('Cancel Add Schedule button not found');
        }

        // Add Schedule form submission
        if (addScheduleForm) {
            addScheduleForm.addEventListener('submit', AddSchedule);
        }
        
        // Close Add Schedule modal when Close button is clicked
        const closeModalBtn = document.querySelector('.closeModalBtn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeAddScheduleModal);
        } else {
            console.error('Close Modal button not found');
        }
    }

    // add room modal
    function openAddRoomModal() { 
        addModal.style.display = 'block'; 

        if (!document.querySelector('#roomIdField').value) {
            resetAddRoomForm(); 
        }
    }
    

    function closeAddRoomModal() { 
        addModal.style.display = 'none'; 
    }

    // show confirmation modal msg
    function openRoomCreatedModal(roomId) {
        const modal = document.getElementById('roomCreatedModal');
        if (modal) {
            modal.style.display = 'block'; // Show the modal
            
            const addScheduleButton = document.getElementById('addScheduletoRoom');
            if (addScheduleButton) {
                addScheduleButton.setAttribute('data-room-id', roomId); 
                console.log('Room ID set to button:', roomId); 
            }
            
            const roomIdField = document.querySelector('#roomIdField');
            if (roomIdField) {
                roomIdField.value = roomId;
            }
        } else {
            console.error('Room created modal not found');
        }
    }
    

    // close confirmation modal
    function closeRoomCreatedModal() {
        const modal = document.getElementById('roomCreatedModal');
        if (modal) {
            modal.style.display = 'none'; 
        } else {
            console.error('Room created modal not found');
        }
    }

    // add schedule to created room modal
    function openAddScheduleModal(roomId) {
        if (addScheduleModal) {
            addScheduleModal.style.display = 'block';  // Show the modal
            addScheduleModal.setAttribute('data-room-id', roomId); 
            console.log('openaddschedulemodal room id is:', roomId)
            const scheduleForm = addScheduleModal.querySelector('form');
            scheduleForm.reset();  
        } else {
            console.error('Add Schedule modal not found');
        }
    }
    

    // close add schedule modal
    function closeAddScheduleModal() {
        if (addScheduleModal) {
            addScheduleModal.style.display = 'none';
        } else {
            console.error('Add Schedule modal not found');
        }
    }

    // reset add room form modal
    function resetAddRoomForm() {
        addRoomForm.reset();

        // reset hidden room id
        const roomIdField = document.querySelector('#roomIdField');
        if (roomIdField) {
            roomIdField.value = '';
        }
        
        // reset checkbox 
        const equipmentCheckboxes = addRoomForm.querySelectorAll('.equipment input[type="checkbox"]');
        equipmentCheckboxes.forEach(checkbox => checkbox.checked = false);
    }

    // get rooms
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

    // render rooms
    function renderRoomRows(rooms) {
        rooms.forEach(room => {
        const row = document.createElement('tr');
        row.classList.add('room-item');

        let ongoingSchedule = 'N/A'; 
        if (room.ongoing_schedule && room.ongoing_schedule.starting_time && room.ongoing_schedule.ending_time) {
            const startTime = dateTimeFormat(room.ongoing_schedule.starting_time);
            const endTime = dateTimeFormat(room.ongoing_schedule.ending_time);
            ongoingSchedule = `${startTime} - ${endTime}`;
        }

        // Create the row HTML
        row.innerHTML = `
            <td>${room.room_building}</td>
            <td>${room.room_number}</td>
            <td>${ongoingSchedule}</td>
            <td>${room.status}</td>
            <td>
                <button class="update-btn" data-room-id="${room.id}">Update</button>
                <button class="remove-btn" data-room-id="${room.id}">Remove</button>
            </td>
        `;

            roomListBody.appendChild(row);

            // btn event listeners
            row.querySelector('.remove-btn').addEventListener('click', () => handleRemoveRoom(room.id, row));
            row.querySelector('.update-btn').addEventListener('click', () => {handleUpdateRoom(room.id); });
        });
    }

    // delete room confirmation
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

    // delete room
    function removeRoom(roomId) {
        RoomViewModel.deleteRoom(roomId)
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                } else {
                    showToast('Failed to remove room', 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting room:', error);
                showToast('Failed to delete room', 'error');
            });
    }

    // update room
    async function handleUpdateRoom(roomId) {
        try {
            const result = await RoomViewModel.getRoomById(roomId);

            if (result.success) {
                const room = result.room; 
    
                populateUpdateForm(room);
    
                openAddRoomModal();  
            } else {
                showToast('Room not found', 'error');
            }
        } catch (error) {
            console.error('Error fetching room details:', error);
            showToast('Error fetching room details', 'error');
        }
    }
    
    // form submition
    function populateUpdateForm(room) {
        const roomNumberInput = document.querySelector('input[name="roomNumber"]');
        roomNumberInput.value = room.room_number;
    
        const roomBuildingSelect = document.querySelector('select[name="roomBuilding"]');
        roomBuildingSelect.value = room.room_building; 

        const capacityInput = document.querySelector('input[name="capacity"]');
        capacityInput.value = room.capacity;
    
        const roomTypeSelect = document.querySelector('select[name="roomType"]');
        roomTypeSelect.value = room.room_type;  
    
        const equipmentCheckboxes = document.querySelectorAll('.equipment input[type="checkbox"]');
        equipmentCheckboxes.forEach(checkbox => {
            checkbox.checked = room.equipment && room.equipment.includes(checkbox.value);
        });
    
        const availabilitySelect = document.querySelector('select[name="availability"]');
        availabilitySelect.value = room.status;  

        // room id hidden
        const roomIdField = document.querySelector('#roomIdField');
        if (roomIdField) {
            roomIdField.value = room.id;
        }
    }
    

    // filter rooms by status and search txt
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

    // add/update room
    async function AddRoom(event) {
        event.preventDefault();

        const roomForm = addRoomForm;
        if (!roomForm.checkValidity()) {
            showToast('Please fill out all the required fields', 'error');
            return;
        }

        const roomData = getRoomDataFromForm();

        // check roomid exist in id field
        const roomId = document.querySelector('#roomIdField') ? document.querySelector('#roomIdField').value : null;

        // update room 
        if (roomId) {
            try {
                const result = await RoomViewModel.updateRoom(roomId, roomData);
                if (result.success) {
                    fetchRooms(); 
                    closeAddRoomModal();
                } else {
                    showToast(result.message || 'Error updating room', 'error');
                }
            } catch (error) {
                console.error('Error updating room:', error);
            }
        }

        // create room 
        else {
            try {
                const result = await RoomViewModel.createRoom(roomData);
                if (result.success) {
                    console.log('Room ID passed to modal:', result.roomId); 
                    fetchRooms();
                    closeAddRoomModal();
                    openRoomCreatedModal(); 
                }
            } catch (error) {
                alert('Failed to add room');
                console.error('Error adding room:', error);
            }
        }
    }


    // room data 
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

    // add schedule to the created room
    async function AddSchedule(event) {
        event.preventDefault();
        
        const roomId = addScheduleModal.getAttribute('data-room-id');  // Get room ID from the modal's data attribute
        if (!roomId) {
            showToast('Error: Room ID is not found', 'error');
            return;
        }
    
        if (!addScheduleForm.checkValidity()) {
            showToast('Please fill out all the required fields', 'error');
            return;
        }
    
        const startingTime = addScheduleForm.querySelector('input[name="timeStart"]').value;
        const endingTime = addScheduleForm.querySelector('input[name="timeEnd"]').value;
    
        if (new Date('1970-01-01T' + endingTime) <= new Date('1970-01-01T' + startingTime)) {
            showToast('Ending time must be later than starting time.', 'error');
            return;
        }
    
        const scheduleData = {
            room_id: roomId,  // Include the correct roomId
            block: addScheduleForm.querySelector('select[name="block"]').value,
            date: addScheduleForm.querySelector('input[name="date"]').value,
            starting_time: addScheduleForm.querySelector('input[name="timeStart"]').value + ':00',
            ending_time: addScheduleForm.querySelector('input[name="timeEnd"]').value + ':00',
        };
    
        try {
            const result = await RoomScheduleViewModel.createRoomSchedule(scheduleData);
            if (result.success) {
                showToast('Schedule added successfully!', 'success');
            } else {
                showToast(result.message || 'Error adding schedule', 'error');
            }
        } catch (error) {
            showToast('Error adding schedule', 'error');
            console.error('Error adding schedule:', error);
        }
    }
    
    

    function init() {
        if (addModal) {
            addModal.style.display = 'none';
        }
        if (document.getElementById('roomCreatedModal')) {
            document.getElementById('roomCreatedModal').style.display = 'none'; 
        }
        initEventListeners();
        fetchRooms();
    }

    init();
}
