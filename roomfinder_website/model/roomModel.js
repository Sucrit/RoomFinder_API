


class RoomModel {

    // get room list (room page)
    static getRoomList() {
        return fetch('http://localhost/RoomFinder_API/api/index.php/room', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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

    // delete room route (room page) 
    static deleteRoomById(requestId) {
        return fetch(`http://localhost/RoomFinder_API/api/index.php/room/${requestId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
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
                console.log('Room deleted:', data);
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

export default RoomModel;