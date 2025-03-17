

class RoomRequestModel {

    // get room requests for dashboard route
    static getDashboardDetails() {
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
            return response.json();
        })
        .then(data => {
            return data;  // return the full data
        })
        .catch(error => {
            console.error('Error fetching room requests:', error.message);
            return {};  // Return empty object in case of an error
        });
    }

    
      // get pending requests route
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
            return response.json();
        })
        .then(data => {
            console.log('Pending Requests:', data);
            return data;
        })
        .catch(error => {
            
            console.error('Error fetching pending requests:', error.message);
        });
    }


    // update pending request status
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


    // get all request history route
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
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching request history:', error.message);
        });
    }

    // delete request history route
    static deleteRequestHistory(requestId) {
        return fetch(`http://localhost/RoomFinder_API/api/index.php/room_request/${requestId}`, {
            method: 'DELETE',
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
            console.log('Request deleted:', data);
            return data;
        })
        .catch(error => {
            console.error('Error deleting request:', error.message);
        });
    }
}    

export default RoomRequestModel;