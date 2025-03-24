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

    const roomNumberSelect = document.querySelector('#addRoomNumberSelect');
    const addRoomBldgSelect = document.querySelector('#addRoomBuildingSelect');

    let selectedStatus = 'all';
    let searchText = '';


    const buildingRoomsMap = {
        "PTC": ["302", "403", "404", "405", "406"],
        "ITS": ["201", "202"]
    };


    function updateRoomNumberOptions(building) {
        roomNumberSelect.innerHTML = ""; // Clear previous options

        if (buildingRoomsMap[building]) {
            buildingRoomsMap[building].forEach(roomNumber => {
                const option = document.createElement("option");
                option.value = roomNumber;
                option.textContent = roomNumber;
                roomNumberSelect.appendChild(option);
            });
        }
    }


    addRoomBldgSelect.addEventListener('change', () => {
        const selectedBuilding = addRoomBldgSelect.value;
        updateRoomNumberOptions(selectedBuilding); // Update room numbers based on the selected building
    });

    // Event listener for building selection change
    addRoomBldgSelect.addEventListener('change', () => {
        const selectedBuilding = addRoomBldgSelect.value;
        updateRoomNumberOptions(selectedBuilding);
    });

    // Initial setup (optional) to load rooms for the default building selection
    updateRoomNumberOptions(addRoomBldgSelect.value);


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
            backBtn.addEventListener('click', closeAddRoomModal);
        }

        // create schedule
        const addScheduleBtn = document.getElementById('addScheduletoRoom');
        if (addScheduleBtn) {
            addScheduleBtn.addEventListener('click', () => {
            });
        } else {
            console.error('Add Schedule button not found');
        }

        const cancelAddScheduleBtn = document.getElementById('cancelAddSchedule');
        if (cancelAddScheduleBtn) {
            cancelAddScheduleBtn.addEventListener('click', closeRoomCreatedModal);
        } else {
            console.error('Cancel Add Schedule button not found');
        }
        if (addScheduleForm) {
            addScheduleForm.addEventListener('submit', AddSchedule);
        }
    }
    function openAddRoomModal() {
        addModal.style.display = 'block';
    }
    function closeAddRoomModal() {
        addModal.style.display = 'none';
    }

    // show confirmation modal msg
    function openRoomCreatedModal() {
        const modal = document.getElementById('roomCreatedModal');
        if (modal) {
            modal.style.display = 'block';
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
        const addScheduleModal = document.getElementById('addScheduleModal');
        if (addScheduleModal) {
            addScheduleModal.style.display = 'block';
            addScheduleModal.setAttribute('data-room-id', roomId);
        } else {
            console.error('Add schedule modal not found');
        }
    }


    // close add schedule modal
    function closeAddScheduleModal() {
        if (addScheduleModal) {
            addScheduleModal.style.display = 'none';
        } else {
            console.error('Add schedule modal not found');
        }
    }

    function resetAddScheduleForm() {
        const addScheduleForm = document.querySelector('.roomdetails_form');
        if (addScheduleForm) {
            addScheduleForm.reset();
        } else {
            console.error('Add Schedule Form not found');
        }
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

            // Debugging: Log the ongoing_schedule data to ensure it exists
            console.log('Ongoing schedule for room:', room.id, room.ongoing_schedule);

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
            row.querySelector('.update-btn').addEventListener('click', () => handleUpdateRoom(room.id));
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

    // add room
    async function AddRoom(event) {
        event.preventDefault();

        const roomForm = addRoomForm;
        if (!roomForm.checkValidity()) {
            showToast('Please fill out all the required fields', 'error');
            return;
        }

        const roomData = getRoomDataFromForm();
        try {
            const result = await RoomViewModel.createRoom(roomData);
            if (result.success) {

                // get id from create room response
                const roomId = result.room.id;

                fetchRooms();
                closeAddRoomModal();

                openRoomCreatedModal(); // confirmation modal

                const addScheduleBtn = document.querySelector('#roomCreatedModal #addScheduletoRoom');
                const cancelScheduleBtn = document.querySelector('#roomCreatedModal #cancelAddSchedule')
                if (addScheduleBtn) {
                    addScheduleBtn.addEventListener('click', () => {
                        openAddScheduleModal(roomId);
                    });
                } else if (cancelScheduleBtn) {
                    cancelScheduleBtn.addEventListener('click', () => {
                        closeAddScheduleModal();
                    })
                }

            } else {
                alert(result.message || 'Error adding room');
            }
        } catch (error) {
            alert('Failed to add room');
            console.error('Error adding room:', error);
        }
    }


    // room data 
    function getRoomDataFromForm() {
        const roomBuilding = document.querySelector('select[name="roomBuilding"]').value;
        const roomNumber = document.querySelector('select[name="roomNumber"]').value;
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

        const roomId = addScheduleModal.getAttribute('data-room-id');
        if (!roomId) {
            showToast('Error: Room ID is not found', 'error');
            return;
        }

        // Check if the form is valid
        if (!addScheduleForm.checkValidity()) {
            showToast('Please fill out all the required fields', 'error');
            return;
        }

        // Validate that the ending time is after the starting time
        const startingTime = addScheduleForm.querySelector('input[name="timeStart"]').value;
        const endingTime = addScheduleForm.querySelector('input[name="timeEnd"]').value;

        if (new Date('1970-01-01T' + endingTime) <= new Date('1970-01-01T' + startingTime)) {
            showToast('Ending time must be later than starting time.', 'error');
            return;
        }

        const scheduleData = {
            room_id: roomId,
            block: addScheduleForm.querySelector('select[name="block"]').value,
            date: addScheduleForm.querySelector('input[name="date"]').value,
            starting_time: addScheduleForm.querySelector('input[name="timeStart"]').value + ':00',
            ending_time: addScheduleForm.querySelector('input[name="timeEnd"]').value + ':00',
        };

        // create schedule
        try {
            const result = await RoomScheduleViewModel.createRoomSchedule(scheduleData);

            if (result.success) {
                resetAddScheduleForm();
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
