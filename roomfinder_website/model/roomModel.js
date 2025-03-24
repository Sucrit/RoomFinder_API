

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
    static getRoomById(id) {

        const authToken = localStorage.getItem('authToken'); 
        if (!authToken) {
            throw new Error("You are not authorized");
        }

        return fetch(`http://localhost/RoomFinder_API/api/index.php/room/${id}`, {
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

    // create room route
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
            if (data.status === 'success') {
                // Handle the room creation success, return room ID instead of 'room' object
                return { status: 'success', message: data.message, roomId: data.id };  // Changed 'room' to 'roomId'
            } else if (data.status === 'error') {
                return { status: 'error', message: data.message };
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            console.error('Error creating room:', error.message);
            throw new Error('Error creating room: ' + error.message);  
        }
    }
    
    
    // update room data route
    static updateRoom(id, updatedData) {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            throw new Error("You are not authorized");
        }

        return fetch(`http://localhost/RoomFinder_API/api/index.php/room/${id}`, {
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
        .then(data => {
            return data; 
        })
        .catch(error => {
            console.error('Error updating room:', error.message);
            throw error;
        });
    }


    // delete room route 
    static deleteRoomById(id) {
        const authToken = localStorage.getItem('authToken'); 

        if (!authToken) {
            throw new Error("You are not authorized");
        }
        
        return fetch(`http://localhost/RoomFinder_API/api/index.php/room/${id}`, {
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