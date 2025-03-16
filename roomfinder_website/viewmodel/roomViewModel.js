import RoomModel from '../model/roomModel.js';

export default class RoomViewModel {
    constructor() {
        this.rooms = [];
    }

    loadRooms() {
        return RoomModel.getRoomList()
            .then(response => {
                if (response && response['Room List'] && Array.isArray(response['Room List'])) {
                    this.rooms = response['Room List'].map(room => ({
                        room_building: room.room_building,
                        room_number: room.room_number,
                        status: room.status,
                        schedules: room.schedules || [], 
                    }));
                    this.renderRooms();
                    return { status: 'success', message: 'Rooms loaded successfully', rooms: this.rooms };
                } else {
                    console.error('Error: Room List not found or API response is incorrect');
                    return { status: 'error', message: response.message || 'Error loading rooms' };
                }
            })
            .catch(error => {
                console.error('Error loading rooms:', error);
                return { status: 'error', message: error.message || 'Error occurred while loading rooms' };
            });
    }
   

    renderRooms() {
        const roomTableBody = document.getElementById('roomTableBody');
        if (!roomTableBody) {
            console.error('Room table body element not found');
            return;
        }
        roomTableBody.innerHTML = '';
   
        this.rooms.forEach(room => {
            const row = document.createElement('tr');
   
            // room building column
            const buildingCell = document.createElement('td');
            buildingCell.textContent = room.room_building;
            row.appendChild(buildingCell);
   
            // room number column
            const numberCell = document.createElement('td');
            numberCell.textContent = room.room_number;
            row.appendChild(numberCell);
   
            // ongoing schedules column
            const scheduleCell = document.createElement('td');
            if (room.schedules.length > 0) {
                const scheduleList = room.schedules.map(schedule => {
                    return `${schedule.block} (${schedule.starting_time} - ${schedule.ending_time}) on ${schedule.date}`;
                }).join(', ');
                scheduleCell.textContent = scheduleList;
            } else {
                scheduleCell.textContent = 'No ongoing schedules';
            }
            row.appendChild(scheduleCell);
   
            // status column
            const statusCell = document.createElement('td');
            statusCell.textContent = room.status;
            row.appendChild(statusCell);
   
            // action column 
            const actionCell = document.createElement('td');
            const actionButton = document.createElement('button');
            actionButton.textContent = 'Edit';
            actionButton.onclick = () => this.openEditRoomModal(room);  
            actionCell.appendChild(actionButton);
            row.appendChild(actionCell);
   
            roomTableBody.appendChild(row);
        });
    }
}   
