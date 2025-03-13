class RoomRequest {
    // Fetch all room requests (e.g., for the dashboard)
    static getRoomRequests() {
        return fetch('http://localhost/RoomFinder_API/api/index.php/room_request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            // Check if the response is OK
            if (!response.ok) {
                // Handle non-OK response (e.g., 404, 500, etc.)
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Try to parse the response as JSON
            return response.json().catch(err => {
                // Handle invalid JSON
                throw new Error("Failed to parse response as JSON: " + err);
            });
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            // Catch and handle any errors
            console.error('Error fetching room requests:', error.message);
        });
    }

    static getPendingRequests() {
        return fetch('http://localhost/RoomFinder_API/api/index.php/room_request/pending_request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            // Check if the response is OK
            if (!response.ok) {
                // Handle non-OK response (e.g., 404, 500, etc.)
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Try to parse the response as JSON
            return response.json().catch(err => {
                // Handle invalid JSON
                throw new Error("Failed to parse response as JSON: " + err);
            });
        })
        .then(data => {
            console.log('Pending Requests:', data);
            return data;
        })
        .catch(error => {
            // Catch and handle any errors
            console.error('Error fetching pending requests:', error.message);
        });
    }
}    

export default RoomRequest;