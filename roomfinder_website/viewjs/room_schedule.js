import RoomScheduleViewModel from '../viewmodel/roomscheduleViewModel.js';
import { showToast } from '../viewjs/toast.js';  

export function InitRoomScheduleSection() {
    const scheduleSection = document.getElementById('room_schedule');
    const scheduleBody = scheduleSection.querySelector('#room-schedules-tbody');
    
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
                            <td>${schedule.date || 'N/A'}</td>
                            <td>${schedule.starting_time || 'N/A'}</td>
                            <td>${schedule.ending_time || 'N/A'}</td>
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
                                
                                // Show the confirmation toast
                                showToast('Are you sure you want to delete this schedule?', 'info', {
                                    showButtons: true,
                                    onConfirm: () => {
                                        row.classList.add('ud-button-animation');
                                        // Remove the row after toast message stays visible
                                        RoomScheduleViewModel.deleteRoomSchedule(scheduleId)
                                            .then(response => {
                                                if (response.success) {
                                                    showToast(response.message, 'success'); 
                                                    row.remove(); // Remove row after successful deletion
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
}

// Handle view button click (can be expanded for detailed views)
function handleView(scheduleId) {
    console.log(`Viewing schedule with ID: ${scheduleId}`);
}
