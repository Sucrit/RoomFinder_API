import RoomRequestModel from '../model/roomrequestModel.js';
import AdminViewModel from '../viewmodel/adminViewModel.js';

export default class RoomRequestViewModel {

    // load all dashboard details

    static loadRoomRequests() {
        console.log('Loading dashboard...');
        RoomRequestModel.getRoomRequests()
            .then(data => {
                console.log('Data received:', data);  

                // percentage calculation
                const totalRequests = parseInt(data["pending count"]) + parseInt(data["approved count"]) + parseInt(data["rejected count"]);
                const pendingPercentage = ((data["pending count"] / totalRequests) * 100).toFixed(2);
                const approvedPercentage = ((data["approved count"] / totalRequests) * 100).toFixed(2);
                const rejectedPercentage = ((data["rejected count"] / totalRequests) * 100).toFixed(2);

                const totalRoom = parseInt(data["available count"]) + parseInt(data["occupied count"]) + parseInt(data["closed count"]);
                const availablePercentage = ((data["available count"] / totalRoom) * 100).toFixed(2);
                const occupiedPercentage = ((data["occupied count"] / totalRoom) * 100).toFixed(2);
                const closedPercentage = ((data["closed count"] / totalRoom) * 100).toFixed(2);

                // update dashboard details
                document.getElementById('totalRequests').innerText = totalRequests;
                document.getElementById('pendingRequests').innerText = data["pending count"];
                document.getElementById('pendingPercentage').innerText = pendingPercentage + '%';
                document.getElementById('approvedRequests').innerText = data["approved count"];
                document.getElementById('approvedPercentage').innerText = approvedPercentage + '%';
                document.getElementById('rejectedRequests').innerText = data["rejected count"];
                document.getElementById('rejectedPercentage').innerText = rejectedPercentage + '%';

               
                document.getElementById('totalRooms').innerText = totalRoom;
                document.getElementById('availableRooms').innerText = data["available count"];
                document.getElementById('availablePercentage').innerText = availablePercentage + '%';
                document.getElementById('occupiedRooms').innerText = data["occupied count"];
                document.getElementById('occupiedPercentage').innerText = occupiedPercentage + '%';
                document.getElementById('closedRooms').innerText = data["closed count"];
                document.getElementById('closedPercentage').innerText = closedPercentage + '%';

                // ongoing schedules
                const ongoingScheduleBody = document.getElementById('ongoingSchedule').querySelector('tbody');
                ongoingScheduleBody.innerHTML = ''; 
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
                
                // request history
                const requestHistoryBody = document.getElementById('requestHistory').querySelector('tbody');
                requestHistoryBody.innerHTML = ''; 
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
                const adminViewModel = new AdminViewModel();  
                console.log(adminViewModel); 
                // adminViewModel.updateProfile();
            })
            .catch(error => {
                console.error('Error fetching room requests:', error);
            });
    }   

    // load pending room requests
    static loadPendingRequests() {
    console.log('Loading pending room requests...');
    RoomRequestModel.getPendingRequests()
        .then(response => {
            console.log('Pending Data received:', response);  

            const pendingRequests = response["Pending Requests"];
            if (Array.isArray(pendingRequests)) {
                const pendingRequestBody = document.getElementById('pending_request').querySelector('tbody');
                pendingRequestBody.innerHTML = ''; 

                pendingRequests.forEach(request => {
                    const row = document.createElement('tr');
                    row.innerHTML = `  
                        <td>${request.username || 'N/A'}</td>
                        <td>${request.date}</td>
                        <td>${request.starting_time}</td>
                        <td>${request.ending_time}</td>
                        <td>${request.purpose || 'N/A'}</td>
                        <td>
                            <button class="approve-btn" data-username="${request.username}" data-id="${request.id}">Approve</button>
                            <button class="reject-btn" data-username="${request.username}" data-id="${request.id}">Reject</button>
                        </td>
                    `;
                    pendingRequestBody.appendChild(row);
                });

                // event listeners for status update    
                const approveButtons = document.querySelectorAll('.approve-btn');
                approveButtons.forEach(button => {
                    button.addEventListener('click', RoomRequestViewModel.approvedStatus);
                });

                const rejectButtons = document.querySelectorAll('.reject-btn');
                rejectButtons.forEach(button => {
                    button.addEventListener('click', RoomRequestViewModel.rejectedStatus);
                });
            } else {
                console.error('Expected "Pending Requests" array but got:', response);
            }
        })
        .catch(error => {
            console.error('Error fetching pending requests:', error);
        });
    }


// update request event listener
static approvedStatus(event) {
    const requestId = event.target.getAttribute('data-id');
    console.log(`Approved request ID: ${requestId}`);

    RoomRequestModel.updateRequestStatus(requestId, 'approved')
        .then(() => {
            RoomRequestViewModel.loadPendingRequests();
        })
        .catch((error) => {
            console.error('Failed to approve request:', error.message);
        });
}

// reject request event listener
static rejectedStatus(event) {
    const requestId = event.target.getAttribute('data-id');
    console.log(`Rejected request ID: ${requestId}`);

    RoomRequestModel.updateRequestStatus(requestId, 'rejected')
        .then(() => {

            RoomRequestViewModel.loadPendingRequests();
        })
        .catch((error) => {
            console.error('Failed to reject request:', error.message);
        });
}



    // get all request history (approved and rejected only)
    static loadRequestHistory() {
        console.log('Loading request history...');
        RoomRequestModel.getRequestHistory()
            .then(response => {
                console.log('Request History:', response);

                const requestHistory = response["Room Request History"];
                if (Array.isArray(requestHistory)) {
                    const requestHistoryBody = document.getElementById('request_history').querySelector('tbody');
                    requestHistoryBody.innerHTML = ''; 

                    requestHistory.forEach(request => {
                        const row = document.createElement('tr');
                        row.innerHTML = `  
                            <td>${request.username || 'N/A'}</td>
                            <td>${request.room_building || 'N/A'}</td>
                            <td>${request.room_number || 'N/A'}</td>
                            <td>${request.block || 'N/A'}</td>
                            <td>${request.date || 'N/A'}</td>
                            <td>${request.starting_time || 'N/A'}</td>
                            <td>${request.ending_time || 'N/A'}</td>
                            <td>${request.status || 'N/A'}</td>
                            <td>
                                <button class="delete-btn" data-username="${request.username}" data-id="${request.id}">Delete</button>  
                            </td>
                        `;
                        requestHistoryBody.appendChild(row);
                    });

                    const deleteButtons = document.querySelectorAll('.delete-btn');  
                    deleteButtons.forEach(button => {
                        button.addEventListener('click', RoomRequestViewModel.deleteRequest); 
                    });

                } else {
                    console.error('Expected "Request History" array but got:', response);
                }
            })
            .catch(error => {
                console.error('Error fetching request history:', error);
            });
    }

// delete request history
static deleteRequest(event) {
    const requestId = event.target.getAttribute('data-id');
    console.log(`Deleting request ID: ${requestId}`);

    RoomRequestModel.deleteRequest(requestId)  // assuming deleteRequest method exists
        .then(() => {
            RoomRequestViewModel.loadPendingRequests();
        })
        .catch((error) => {
            console.error('Failed to delete request:', error.message);
        });
}
}
