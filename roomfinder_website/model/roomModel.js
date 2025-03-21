

export default class RoomModel {

    // get room list route (room page)
    static getRoomList() {

        const authToken = localStorage.getItem('authToken'); 
        if (!authToken) {
            throw new Error("You are not authorized");
        }

        return fetch('http://localhost/RoomFinder_API/api/index.php/room', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => { 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching room requests:', error.message);
        });
    }

    // get room by id route
    static getRoomById(roomId) {

        const authToken = localStorage.getItem('authToken'); 
        if (!authToken) {
            throw new Error("You are not authorized");
        }

        return fetch(`http://localhost/RoomFinder_API/api/index.php/room/${roomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Room Data from API:', data);  
            return data;
        })
        .catch(error => {
            console.error('Error fetching room by ID:', error.message);
            throw error;
        });
    }

    static async createRoom(roomData) {
        try {

            const authToken = localStorage.getItem('authToken'); 
            if (!authToken) {
                throw new Error("You are not authorized");
            }

            const response = await fetch('http://localhost/RoomFinder_API/api/index.php/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(roomData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.room_number && data.room_building) {
                return { success: true, room: data }; 
            } else {
                throw new Error('Invalid room data returned');
            }
        } catch (error) {
            console.error('Error creating room:', error.message);
            throw error;
        }
    }
    

    // update room data route
    static updateRoom(roomId, updatedData) {

        const authToken = localStorage.getItem('authToken'); 
        if (!authToken) {
            throw new Error("You are not authorized");
        }

        return fetch(`http://localhost/RoomFinder_API/api/index.php/room/${roomId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();  
        })
        .catch(error => {
            console.error('Error updating room:', error.message);
            throw error; 
        });
    }

    // delete room route 
    static deleteRoomById(requestId) {

        const authToken = localStorage.getItem('authToken'); 
        if (!authToken) {
            throw new Error("You are not authorized");
        }
        
        return fetch(`http://localhost/RoomFinder_API/api/index.php/room/${requestId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();  
        })
        .then(data => {
            if (data.message === 'Room has been deleted') {
                return { success: true, message: 'Room deleted successfully' };
            } else {
                throw new Error('Failed to delete room');
            }
        })
        .catch(error => {
            console.error('Error deleting room:', error.message);
            throw error; 
        });
    }
}