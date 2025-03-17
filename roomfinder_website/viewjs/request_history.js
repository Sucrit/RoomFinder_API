
// request history dom/M
import RoomRequestViewModel from '../viewmodel/roomrequestViewModel.js';

export function InitRequestHistorySection() {
    const requestHistorySection = document.getElementById('request_history');
    if (!requestHistorySection) {
        console.error('Error: #request_history section not found in the DOM.');
        return;
    }

    const requestHistoryBody = requestHistorySection.querySelector('tbody');
    if (!requestHistoryBody) {
        console.error('Error: tbody not found inside #request_history.');
        return;
    }

    // load request history from server
    function loadRequestHistory() {
        RoomRequestViewModel.getRoomRequestHistory()
            .then(response => {
                const requestHistory = response.history; 
                if (Array.isArray(requestHistory)) {
                    requestHistoryBody.innerHTML = ''; 

                    requestHistory.forEach(request => {
                        const row = document.createElement('tr');
                        row.classList.add('request-item');

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
                                <button class="delete-btn" data-id="${request.id}">Delete</button>  
                            </td>
                        `;
                        requestHistoryBody.appendChild(row);

                        // delete button event listener
                        const deleteBtn = row.querySelector('.delete-btn');
                        deleteBtn.addEventListener('click', () => {
                            const requestId = deleteBtn.getAttribute('data-id');

                            row.remove();
                            RoomRequestViewModel.deleteRoomRequestHistory(requestId)
                                .then(() => {
                                    console.log('Request deleted successfully');
                                })
                                .catch((error) => {
                                    console.error('Failed to delete request:', error.message);
                                });
                        });
                    });
                } else {
                    console.error('Expected "Room Request History" array but got:', response);
                }
            })
            .catch(error => {
                console.error('Error fetching request history:', error);
            });
    }
    loadRequestHistory();
}
