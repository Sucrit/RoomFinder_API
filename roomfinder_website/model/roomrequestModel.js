


class RoomRequestModel {

    // get room requests for dashboard only!
    static getRoomRequests() {
        return fetch('http://localhost/RoomFinder_API/api/index.php/room_request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            return response.json().catch(err => {
                throw new Error("Failed to parse response as JSON: " + err);
            });
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching room requests:', error.message);
        });
    }

    // get pending requests
    static getPendingRequests() {
        return fetch('http://localhost/RoomFinder_API/api/index.php/room_request/pending_request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json().catch(err => {

                throw new Error("Failed to parse response as JSON: " + err);
            });
        })
        .then(data => {
            console.log('Pending Requests:', data);
            return data;
        })
        .catch(error => {
            
            console.error('Error fetching pending requests:', error.message);
        });
    }

    // get all request history
    static getRequestHistory() {
        return fetch('http://localhost/RoomFinder_API/api/index.php/room_request/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json().catch(err => {
                throw new Error("Failed to parse response as JSON: " + err);
            });
        })
        .then(data => {
            console.log('Request History:', data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching request history:', error.message);
        });
    }


    // update request status (approved or rejected)
    static updateRequestStatus(requestId, status) {
        const requestData = { status: status };

        return fetch(`http://localhost/RoomFinder_API/api/index.php/room_request/${requestId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Request status updated to ${status}:`, data);
            return data;
        })
        .catch(error => {
            console.error('Error updating request status:', error.message);
        });
    }
}    

export default RoomRequestModel;