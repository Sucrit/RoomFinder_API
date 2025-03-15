


class RoomModel {

    // get room list
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
}

export default RoomModel;
