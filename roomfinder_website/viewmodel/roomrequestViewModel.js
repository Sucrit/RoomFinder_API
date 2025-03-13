import RoomRequest from '../model/roomrequestModel.js';

export default class RoomRequestViewModel {

    // load all details needed for dashboard 
    static loadRoomRequests() {
        console.log('Loading dashboard...');
        RoomRequest.getRoomRequests()
            .then(data => {
                console.log('Data received:', data);  // Log the entire data object
   
                const totalRequests = parseInt(data["pending count"]) + parseInt(data["approved count"]) + parseInt(data["rejected count"]);
                const pendingPercentage = ((data["pending count"] / totalRequests) * 100).toFixed(2);
                const approvedPercentage = ((data["approved count"] / totalRequests) * 100).toFixed(2);
                const rejectedPercentage = ((data["rejected count"] / totalRequests) * 100).toFixed(2);

                const totalRoom = parseInt(data["available count"]) + parseInt(data["occupied count"]) + parseInt(data["closed count"]);
                const availablePercentage = ((data["available count"] / totalRoom) * 100).toFixed(2);
                const occupiedPercentage = ((data["occupied count"] / totalRoom) * 100).toFixed(2);
                const closedPercentage = ((data["closed count"] / totalRoom) * 100).toFixed(2);

                // Populate Requests Section
                document.getElementById('totalRequests').innerText = totalRequests;
                document.getElementById('pendingRequests').innerText = data["pending count"];
                document.getElementById('pendingPercentage').innerText = pendingPercentage + '%';
                document.getElementById('approvedRequests').innerText = data["approved count"];
                document.getElementById('approvedPercentage').innerText = approvedPercentage + '%';
                document.getElementById('rejectedRequests').innerText = data["rejected count"];
                document.getElementById('rejectedPercentage').innerText = rejectedPercentage + '%';

                // Populate Requests Section
                document.getElementById('totalRooms').innerText = totalRoom;
                document.getElementById('availableRooms').innerText = data["available count"];
                document.getElementById('availablePercentage').innerText = availablePercentage + '%';
                document.getElementById('occupiedRooms').innerText = data["occupied count"];
                document.getElementById('occupiedPercentage').innerText = occupiedPercentage + '%';
                document.getElementById('closedRooms').innerText = data["closed count"];
                document.getElementById('closedPercentage').innerText = closedPercentage + '%';
   
                // Populate Ongoing Schedule Table
                const ongoingScheduleBody = document.getElementById('ongoingSchedule').querySelector('tbody');
                ongoingScheduleBody.innerHTML = ''; // Clear existing rows
                data["Ongoing schedule"].forEach(schedule => {
                    const row = document.createElement('tr');
                    row.innerHTML = `  
                        <td>${schedule.room_building || 'N/A'}</td>
                        <td>${schedule.room_number || 'N/A'}</td>
                        <td>${schedule.block || 'N/A'}</td>
                        <td>${schedule.date}</td>
                        <td>${schedule.starting_time}</td>
                        <td>${schedule.ending_time}</td>
                    `;
                    ongoingScheduleBody.appendChild(row);
                });
                
   
                // Populate Request History Table
                const requestHistoryBody = document.getElementById('requestHistory').querySelector('tbody');
                requestHistoryBody.innerHTML = ''; // Clear existing rows
                data["Request history"].forEach(request => {
                    const row = document.createElement('tr');
                    row.innerHTML = `  
                        <td>${request.username || 'N/A'}</td>
                        <td>${request.block || 'N/A'}</td>
                        <td>${request.date}</td>
                        <td>${request.starting_time}</td>
                        <td>${request.ending_time}</td>
                    `;
                    requestHistoryBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching room requests:', error);
            });
    }   

    static loadPendingRequests() {
        console.log('Loading pending room requests...');
        RoomRequest.getPendingRequests()
            .then(response => {
                console.log('Pending Data received:', response);  // Log the entire data object
    
                // Check if the response has "Pending Requests" key and it is an array
                const pendingRequests = response["Pending Requests"];
                if (Array.isArray(pendingRequests)) {
                    // Populate Pending Request Table
                    const pendingRequestBody = document.getElementById('pendingRequest').querySelector('tbody');
                    pendingRequestBody.innerHTML = ''; // Clear existing rows
    
                    pendingRequests.forEach(request => {
                        const row = document.createElement('tr');
                        row.innerHTML = `  
                            <td>${request.username || 'N/A'}</td>
                            <td>${request.date}</td>
                            <td>${request.starting_time}</td>
                            <td>${request.ending_time}</td>
                            <td>${request.purpose || 'N/A'}</td>
                        `;
                        pendingRequestBody.appendChild(row);
                    });
                } else {
                    console.error('Expected "Pending Requests" array but got:', response);
                }
            })
            .catch(error => {
                console.error('Error fetching pending requests:', error);
            });
    }

}
