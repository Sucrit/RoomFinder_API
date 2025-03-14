class RoomViewModel {

    static loadRooms() {
        RoomModel.getRoomList()  // Fetch the room data from RoomModel
            .then(rooms => {
                this.renderRoomList(rooms);  // Once data is fetched, pass it to render function
            })
            .catch(error => {
                console.error('Error loading rooms:', error.message);
            });
    }

    // This method takes the data from the model and renders it into the view (UI)
    static renderRoomList(rooms) {
        const roomListElement = document.getElementById('roomList');  // Assuming you have a container in your HTML

        roomListElement.innerHTML = ''; // Clear the room list before re-rendering it

        rooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.classList.add('room');  // For styling purposes

            // Render room details (Building, Room Number, etc.)
            roomElement.innerHTML = `
                <h3>${room.room_building} - ${room.room_number}</h3>
                <p>Status: ${room.status}</p>
                <p>Type: ${room.room_type}</p>
                <p>Capacity: ${room.capacity}</p>
                <button class="view-schedules-btn" data-room-id="${room.id}">View Schedules</button>
                <div class="schedules" id="schedules-${room.id}"></div>
            `;

            // Append this room to the list of rooms in the UI
            roomListElement.appendChild(roomElement);

            // Attach event listeners for the 'View Schedules' buttons
            const scheduleButton = roomElement.querySelector('.view-schedules-btn');
            scheduleButton.addEventListener('click', () => this.loadSchedules(room.id));  // On click, load the schedules for this room
        });
    }

    // This method will load the schedules for a specific room
    static loadSchedules(roomId) {
        const schedulesElement = document.getElementById(`schedules-${roomId}`);
        schedulesElement.innerHTML = ''; // Clear previous schedules if any

        // Fetch schedules for the selected room
        const room = RoomModel.getRoomList().then(rooms => {
            const selectedRoom = rooms.find(r => r.id === roomId);
            if (selectedRoom && selectedRoom.schedules.length > 0) {
                selectedRoom.schedules.forEach(schedule => {
                    const scheduleElement = document.createElement('div');
                    scheduleElement.classList.add('schedule');

                    scheduleElement.innerHTML = `
                        <p>Block: ${schedule.block || 'N/A'}</p>
                        <p>Date: ${schedule.date}</p>
                        <p>Time: ${schedule.starting_time} - ${schedule.ending_time}</p>
                    `;

                    schedulesElement.appendChild(scheduleElement);
                });
            } else {
                schedulesElement.innerHTML = '<p>No schedules available.</p>';
            }
        }).catch(error => {
            console.error('Error loading schedules:', error.message);
        });
    }
}
