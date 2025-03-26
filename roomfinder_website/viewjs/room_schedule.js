// room schedule dom/M
import RoomScheduleViewModel from '../viewmodel/roomscheduleViewModel.js';
import { showToast } from '../viewjs/toast.js';
import { dateTimeFormat } from '../viewjs/timeformat.js';

export function InitRoomScheduleSection() {
    const scheduleSection = document.getElementById('room_schedule');
    const scheduleBody = scheduleSection.querySelector('.table-data');

    const addModal = document.getElementById('modal');
    const floatingBtn = document.querySelector('.floating-btn');
    const addCloseBtn = document.querySelector('#modal .closemodal');
    const addRoomForm = document.querySelector('.roomdetails_form');

    // Initialize events
    function initEventListeners() {
        floatingBtn.addEventListener('click', openAddRoomForm);
        addCloseBtn.addEventListener('click', closeAddRoomModal);
        window.addEventListener('click', closeModalOnClickOutside);
        addRoomForm.addEventListener('submit', handleAddRoom);
    }

    // Modal handling
    function openAddRoomForm() {
        addModal.style.display = 'block';
    }

    function closeAddRoomModal() {
        addModal.style.display = 'none';
    }

    function closeModalOnClickOutside(event) {
        if (event.target === addModal) {
            closeAddRoomModal();
        }
    }

    // Fetch schedules and render them
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

    function renderSchedules(schedules) {
        schedules.forEach(schedule => {
            const row = createScheduleRow(schedule);
            scheduleBody.appendChild(row);
        });
    }

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
                <button class="update-btn" data-id="${schedule.id}">Update</button>
                <button class="delete-btn" data-id="${schedule.id}">Delete</button>
            </td>
        `;

        // Add event listeners for buttons
        row.querySelector('.update-btn').addEventListener('click', () => handleView(schedule.id));
        row.querySelector('.delete-btn').addEventListener('click', () => handleDelete(schedule, row));

        return row;
    }

    function showNoSchedulesMessage(message) {
        scheduleBody.innerHTML = `<tr><td colspan="6">${message}</td></tr>`;
    }

    // Handle delete schedule
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

    // Handle adding room
    async function handleAddRoom(event) {
        event.preventDefault();

        const roomData = getRoomFormData();
        try {
            const result = await RoomScheduleViewModel.createRoom(roomData);
            if (result.success) {
                showToast('Room added successfully!', 'success');
                fetchSchedules();
                closeAddRoomModal();
            } else {
                showToast(result.message || 'Error adding room', 'error');
            }
        } catch (error) {
            console.error('Error adding room:', error);
            showToast('Failed to add room', 'error');
        }
    }

    function getRoomFormData() {
        const roomBuilding = document.querySelector('select[name="roomBuilding"]').value;
        const roomNumber = document.querySelector('input[name="roomNumber"]').value;
        const capacity = document.querySelector('input[name="capacity"]').value;
        const roomType = document.querySelector('select[name="roomType"]').value;
        const availability = document.querySelector('select[name="availability"]').value;
        
        const equipmentCheckboxes = document.querySelectorAll('.equipment input[type="checkbox"]:checked');
        const equipment = Array.from(equipmentCheckboxes).map(checkbox => checkbox.value).join(', ');

        return {
            room_building: roomBuilding,
            room_number: roomNumber,
            status: availability,
            equipment: equipment,
            capacity: capacity,
            room_type: roomType
        };
    }

    // view room schedule
    function handleView(scheduleId) {
        console.log(`Viewing schedule with ID: ${scheduleId}`);
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
