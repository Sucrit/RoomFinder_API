export default class RoomScheduleModel {

    // get room schedules (roomschedule section)
    static getRoomSchedules() {

        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error("No authentication token found");
        }

        return fetch('http://localhost/RoomFinder_API/api/index.php/room_schedule', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            console.log('Response status:', response.status);  
            if (!response.ok) {
                console.error('Error response:', response);  
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching room schedules:', error.message); 
            return [];  
        });
    }

    // delete a room schedule by id
    static deleteRoomSchedule(id) {

        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error("No authentication token found");
        }

        return fetch(`http://localhost/RoomFinder_API/api/index.php/room_schedule/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                return data.message;  
            } else {
                throw new Error('Failed to delete schedule');
            }
        })
        .catch(error => {
            console.error('Error deleting room schedule:', error);
            return 'Failed to delete room schedule';
        });
    }

}
