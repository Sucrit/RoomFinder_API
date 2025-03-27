import RoomViewModel from '../viewmodel/roomViewModel.js'; 
import RoomScheduleViewModel from '../viewmodel/roomscheduleViewModel.js';
import { showToast } from '../viewjs/toast.js';
import { dateTimeFormat } from '../viewjs/timeformat.js';

export function InitRoomScheduleSection() {
    const scheduleSection = document.getElementById('room_schedule');
    const scheduleBody = scheduleSection.querySelector('.table-data');
    const addModal = document.getElementById('modal');
    const floatingBtn = document.querySelector('.floating-btn');
    // const addCloseBtn = document.querySelector('#modal .closemodal');
    const addRoomForm = document.querySelector('.roomdetails_form');
    const closeModalBtn = addModal.querySelector('.closeModalBtn');

    // const roomNumberSelect = addModal.querySelector('#roomNumber');
    // const roomBuildingSelect = addModal.querySelector('#roomBldg');

    let selectedRoomId = null;
    let rooms = [];  


    // Initialize events
    function initEventListeners() {
        floatingBtn.addEventListener('click', openAddRoomScheduleModal);
        window.addEventListener('click', closeModalOnClickOutside);
        addRoomForm.addEventListener('submit', handleAddRoomSchedule);
        closeModalBtn.addEventListener('click', closeAddRoomScheduleModal);
    }

    // modal only
    function openAddRoomScheduleModal() {
        addModal.style.display = 'block';
        fetchRooms();
        selectedRoomId = getSelectedRoomId();
        addModal.setAttribute('data-room-id', selectedRoomId);
        setRoomFieldsReadOnly(false);
    
        // Reset button text to "Create" when opening for a new schedule
        const actionButton = addModal.querySelector('.action-btn');
        actionButton.textContent = 'Create';  
    }
    
    function closeAddRoomScheduleModal() {
        addModal.style.display = 'none';
    }
    function closeModalOnClickOutside(event) {
        if (event.target === addModal) {
            closeAddRoomScheduleModal();
        }
    }

    // fetch and render schedule
    async function fetchSchedules() {
        scheduleBody.innerHTML = ''; 
        try {
            const response = await RoomScheduleViewModel.getAllRoomSchedules();
            if (response.success && response.schedules.length > 0) {
                renderSchedules(response.schedules);
            } else {
                showNoSchedulesMessage(response.message || 'No room schedules available');
            }
        } catch (error) {
            console.error('Error loading room schedules:', error);
            showNoSchedulesMessage('Failed to load room schedules.');
        }
    }

    // render rows
    function renderSchedules(schedules) {
        schedules.forEach(schedule => {
            const row = createScheduleRow(schedule);
            scheduleBody.appendChild(row);
        });
    }

    // create schedule row
    function createScheduleRow(schedule) {
        const row = document.createElement('tr');
        row.classList.add('room-schedule-item');

        const startTime = dateTimeFormat(schedule.starting_time);
        const endTime = dateTimeFormat(schedule.ending_time);

        row.innerHTML = `
            <td>${schedule.room_building || 'N/A'}</td>
            <td>${schedule.room_number || 'N/A'}</td>
            <td>${schedule.date + '<br/>' + startTime + ' - ' + endTime || 'N/A'}</td>
            <td>${schedule.block || 'N/A'}</td>
            <td>
                <button class="update-btn" data-id="${schedule.room_id}">Update</button>
                <button class="delete-btn" data-id="${schedule.id}">Delete</button>
            </td>
        `;

        // button event listeners
        row.querySelector('.update-btn').addEventListener('click', () => { console.log(`Attempting to update schedule with ID: ${schedule.id}`); handleUpdate(schedule.id)});
        row.querySelector('.delete-btn').addEventListener('click', () => handleDelete(schedule, row));

        return row;
    }

    function showNoSchedulesMessage(message) {
        scheduleBody.innerHTML = `<tr><td colspan="6">${message}</td></tr>`;
    }

    // handle delete schedule
    function handleDelete(schedule, row) {
        showToast('Are you sure you want to delete this schedule?', 'info', {
            showButtons: true,
            onConfirm: async () => {
                try {
                    const response = await RoomScheduleViewModel.deleteRoomSchedule(schedule.id);
                    if (response.success) {
                        showToast(response.message, 'success');
                        console.log(response.message);
                        row.remove();
                    } else {
                        showToast(response.message, 'error');
                    }
                } catch (error) {
                    console.error('Error deleting schedule:', error);
                    showToast('Failed to delete room schedule', 'error');
                }
            },
            onCancel: () => console.log('Schedule deletion canceled')
        });
    }

    // handle add room schedule
    async function handleAddRoomSchedule(event) {
        event.preventDefault();

        const scheduleData = getRoomFormData();
        const actionButton = addModal.querySelector('.action-btn');

        try {
            // create schedule
            if (actionButton.textContent === 'Create') {
                const response = await RoomScheduleViewModel.createRoomSchedule(scheduleData);
                if (response.status === 'success') {
                    showToast(response.message, 'success');
                    fetchSchedules();
                    closeAddRoomScheduleModal();
                } else {
                    showToast('Failed to create room schedule', 'error');
                }
            }
            // update schedule 
            else if (actionButton.textContent === 'Update') {
                const scheduleId = addModal.getAttribute('data-schedule-id'); 
                const response = await RoomScheduleViewModel.updateRoomSchedule(scheduleId, scheduleData);
                if (response.status === 'success') {
                    showToast(response.message, 'success');
                    fetchSchedules();
                    closeAddRoomScheduleModal();
                } else {
                    showToast('Failed to update room schedule', 'error');
                }
            }
        } catch (error) {
            console.error('Error saving room schedule:', error);
            showToast('An error occurred while saving the schedule', 'error');
        }
    }

    // view & update schedule
    async function handleUpdate(scheduleId) {

        console.log(`Viewing schedule with ID: ${scheduleId}`);
        const response = await RoomScheduleViewModel.getRoomScheduleById(scheduleId);
        
        if (response.success) {
            console.log(response);
            populateScheduleForm(response.schedule);
            await fetchRooms(); 
            addModal.style.display = 'block';

            const actionButton = addModal.querySelector('.action-btn');
            actionButton.textContent = 'Update'; 
        } else {
            showToast(response.message || 'Error fetching schedule', 'error');
        }
    }
    

    // get id of selected room from add schedule form
    function getSelectedRoomId() {
        const selectedRow = document.querySelector('.room-table-container .room-schedule-item.selected');
        
        if (selectedRow) {
            return selectedRow.getAttribute('data-room-id');  
        }
        return null;
    }
    

    // room schedule modal form data
    function getRoomFormData() {
        const block = document.querySelector('select[name="block"]').value;
        const date = document.querySelector('input[name="date"]').value;
        const startingTime = document.querySelector('input[name="timeStart"]').value;
        const endingTime = document.querySelector('input[name="timeEnd"]').value;
        const roomId = document.getElementById('modal').getAttribute('data-room-id');
        
        console.log("submitting room schedule data:", { room_id: roomId, block, date, startingTime, endingTime });

        return {
            room_id: roomId, 
            block: block,
            date: date,
            starting_time: startingTime,
            ending_time: endingTime
        };
    }
    
    // fetch rooms
    async function fetchRooms() {
        try {
            const response = await RoomViewModel.getAllRooms();
            if (response.success && response.rooms.length > 0) {
                rooms = response.rooms;  
                console.log('Rooms fetched:', rooms);
                populateRoomDropdowns(rooms); 

                const firstRoom = rooms[0];
                addModal.setAttribute('data-room-id', firstRoom.id);
                console.log('Initial Room ID set:', firstRoom.id);
            } else {
                showToast('No rooms available', 'error');
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            showToast('Error fetching rooms', 'error');
        }
    }

    // populate the form fields with the schedule data
    function populateScheduleForm(schedule) {
        const blockSelect = addModal.querySelector('select[name="block"]');
        const dateInput = addModal.querySelector('input[name="date"]');
        const startingTimeInput = addModal.querySelector('input[name="timeStart"]');
        const endingTimeInput = addModal.querySelector('input[name="timeEnd"]');
        const roomBuildingSelect = addModal.querySelector('#roomBldg');
        const roomNumberSelect = addModal.querySelector('#roomNumber');
        console.log('Schedule data:', schedule);

        // Set the values in the form based on the schedule data
        blockSelect.value = schedule.block || '';
        dateInput.value = schedule.date || '';
        startingTimeInput.value = formatTime(schedule.starting_time || '');
        endingTimeInput.value = formatTime(schedule.ending_time || '');
        
        roomBuildingSelect.value = schedule.room_building || '';
        roomNumberSelect.value = schedule.room_number || '';
        
        roomBuildingSelect.dispatchEvent(new Event('change')); 

        addModal.setAttribute('data-room-id', schedule.room_id);

        setRoomFieldsReadOnly(true);
        
    }

    // hh:mm format
    function formatTime(time) {
        if (!time) return '';  
        const timeParts = time.split(':'); 
        return timeParts.length >= 2 ? `${timeParts[0]}:${timeParts[1]}` : time;  
    }

    // populate room dropdowns in add schedule form
    function populateRoomDropdowns(rooms) {
        console.log('Fetched rooms:', rooms);
        const buildings = [...new Set(rooms.map(room => room.room_building))]; 
        const roomBuildingSelect = addModal.querySelector('#roomBldg');
        const roomNumberSelect = addModal.querySelector('#roomNumber');
        


        buildings.forEach(building => {
            const option = document.createElement('option');
            option.value = building;
            option.textContent = building;
            roomBuildingSelect.appendChild(option);
        });

        // Populate room number dropdown based on selected building
        roomBuildingSelect.addEventListener('change', () => {
            const selectedBuilding = roomBuildingSelect.value;
            const roomNumbers = rooms.filter(room => room.room_building === selectedBuilding)
                                    .map(room => room.room_number);
            populateRoomNumbers(roomNumbers);
        });

        roomNumberSelect.addEventListener('change', () => {
            updateRoomId();
        });

        roomBuildingSelect.dispatchEvent(new Event('change'));
    }

    function populateRoomNumbers(roomNumbers) {
        const roomNumberSelect = addModal.querySelector('#roomNumber');
        roomNumberSelect.innerHTML = ''; 
        roomNumbers.forEach(roomNumber => {
            const option = document.createElement('option');
            option.value = roomNumber;
            option.textContent = roomNumber;
            roomNumberSelect.appendChild(option);
        });
    }

    // update room id of selected number and bldg
    function updateRoomId() {
        const roomBuildingSelect = addModal.querySelector('#roomBldg');
        const roomNumberSelect = addModal.querySelector('#roomNumber');
        const selectedBuilding = roomBuildingSelect.value;
        const selectedRoomNumber = roomNumberSelect.value;
        
        console.log('Selected Building:', selectedBuilding); 
        console.log('Selected Room Number:', selectedRoomNumber);  
        console.log('Rooms:', rooms);

        const selectedRoom = rooms.find(room => room.room_building === selectedBuilding && room.room_number === selectedRoomNumber);

        if (selectedRoom) {
            addModal.setAttribute('data-room-id', selectedRoom.id);
            console.log(`Room ID set to: ${selectedRoom.id}`);
        } else {
            // If no room found, you can reset or handle the error
            addModal.setAttribute('data-room-id', null);
            console.log('Room ID not found');
        }
    }

    // set room bldg and number to read only 
    function setRoomFieldsReadOnly(isReadOnly) {
        const roomBuildingSelect = addModal.querySelector('#roomBldg');
        const roomNumberSelect = addModal.querySelector('#roomNumber');
        
        if (isReadOnly) {
            roomBuildingSelect.disabled = true;
            roomNumberSelect.disabled = true;
        } else {
            roomBuildingSelect.disabled = false;
            roomNumberSelect.disabled = false;
        }
    }

    function init() {
        if (addModal) {
            addModal.style.display = 'none';
        }
        initEventListeners();
        fetchSchedules();
    }

    init();
}
