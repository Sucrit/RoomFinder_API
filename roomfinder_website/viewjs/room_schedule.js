import RoomScheduleViewModel from '../viewmodel/roomscheduleViewModel.js';
import { showToast } from '../viewjs/toast.js';  

export function InitRoomScheduleSection() {

    const scheduleSection = document.getElementById('room_schedule');
    const scheduleBody = scheduleSection.querySelector('.table-data');

    const addModal = document.getElementById('modal');
    const floatingBtn = document.querySelector('.floating-btn');
    const addCloseBtn = document.querySelector('#modal .closemodal');
    const addRoomForm = document.querySelector('.roomdetails_form');

        // modal functions
        function openAddRoomForm() {
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


    scheduleBody.innerHTML = '';  

    RoomScheduleViewModel.getAllRoomSchedules() 
        .then(response => {
            if (response.success) {
                const schedules = response.schedules;
                if (schedules.length > 0) {
                    schedules.forEach(schedule => {
                        const row = document.createElement('tr');
                        row.classList.add('room-schedule-item');

                        row.innerHTML = `
                            <td>${schedule.room_building || 'N/A'}</td>
                            <td>${schedule.room_number || 'N/A'}</td>
                            <td>${schedule.date + '<br/>' + schedule.starting_time + ' - ' + schedule.ending_time || 'N/A'}</td>
                            <td>${schedule.block || 'N/A'}</td>
                            <td>
                                <button class="update-btn" data-id="${schedule.id}">Update</button>
                                <button class="delete-btn" data-id="${schedule.id}">Delete</button>
                            </td>
                        `;
                        
                        scheduleBody.appendChild(row);

                        // update button event listeners
                        const viewBtn = row.querySelector('.update-btn');
                        if (viewBtn) {
                            viewBtn.addEventListener('click', () => {
                                const scheduleId = viewBtn.getAttribute('data-id');
                                handleView(scheduleId);
                            });
                        }
                        
                        // delete button event listener
                        const deleteBtn = row.querySelector('.delete-btn');
                        if (deleteBtn) {
                            deleteBtn.addEventListener('click', () => {
                                const scheduleId = deleteBtn.getAttribute('data-id');
                                
                                // show toast
                                showToast('Are you sure you want to delete this schedule?', 'info', {
                                    showButtons: true,
                                    onConfirm: () => {
                                        row.classList.add('ud-button-animation');
                                        // remove the row after toast message stays visible
                                        RoomScheduleViewModel.deleteRoomSchedule(scheduleId)
                                            .then(response => {
                                                if (response.success) {
                                                    showToast(response.message, 'success'); 
                                                    row.remove(); 
                                                } else {
                                                    showToast(response.message, 'error');
                                                }
                                            })
                                            .catch(error => {
                                                console.error('Error deleting schedule:', error);
                                                showToast('Failed to delete room schedule', 'error');
                                            });
                                    },
                                    onCancel: () => {
                                        console.log('Schedule deletion canceled');
                                    }
                                });
                            });
                        }
                    });
                } else {
                    scheduleBody.innerHTML = `<tr><td colspan="6">No room schedules available</td></tr>`;
                }
            } else {
                scheduleBody.innerHTML = `<tr><td colspan="6">Error: ${response.message}</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error loading room schedules:', error);
            scheduleBody.innerHTML = `<tr><td colspan="6">Failed to load room schedules.</td></tr>`;
        });

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
    floatingBtn.addEventListener('click', openAddRoomForm);
}

// Handle view button click (can be expanded for detailed views)
function handleView(scheduleId) {
    console.log(`Viewing schedule with ID: ${scheduleId}`);
}