
// pending request section dom/M
import RoomRequestViewModel from '../viewmodel/roomrequestViewModel.js';

export function InitPendingRequestSection() {
    const pendingRequestSection = document.getElementById('pending_request');
    const pendingRequestBody = pendingRequestSection.querySelector('tbody');

    pendingRequestBody.innerHTML = '';
    RoomRequestViewModel.getPendingRequest()
        .then(result => {
            if (result.success) {
                const pendingRequests = result.pendingRequests;
                if (pendingRequests.length > 0) {
                    // row each pending
                    pendingRequests.forEach(request => {
                        const row = document.createElement('tr');
                        row.classList.add('pending-request-item');

                        row.innerHTML = `
                            <td>${request.username || 'N/A'}</td>
                            <td>${request.date || 'N/A'}</td>
                            <td>${request.starting_time || 'N/A'}</td>
                            <td>${request.ending_time || 'N/A'}</td>
                            <td>${request.purpose || 'N/A'}</td>
                            <td>
                                <button class="approve-btn" data-id="${request.id}">Approve</button>
                                <button class="reject-btn" data-id="${request.id}">Reject</button>
                            </td>
                        `;
                        pendingRequestBody.appendChild(row);

                        // event listener
                        const approveBtn = row.querySelector('.approve-btn');
                        approveBtn.addEventListener('click', () => {
                            const requestId = approveBtn.getAttribute('data-id');
                            handleApprove(requestId, row);
                        });
                        const rejectBtn = row.querySelector('.reject-btn');
                        rejectBtn.addEventListener('click', () => {
                            const requestId = rejectBtn.getAttribute('data-id');
                            handleReject(requestId, row);
                        });
                    });
                } else {
                    pendingRequestBody.innerHTML = `<tr><td colspan="6">No pending requests available.</td></tr>`;
                }
            } else {
                pendingRequestBody.innerHTML = `<tr><td colspan="6">Error: ${result.message}</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error loading pending requests:', error);
            pendingRequestBody.innerHTML = `<tr><td colspan="6">Failed to load pending requests.</td></tr>`;
        });

    // approve request handler
    function handleApprove(requestId, row) {
        row.remove(); 
        RoomRequestViewModel.updateRequestStatus(requestId, 'approved')
            .then((response) => {

                if (response.message === "Room request updated successfully") {
                    console.log(`Request ID ${requestId} approved successfully`);
                } else {
                    console.error(`Failed to approve request ID ${requestId}:`, response.message);
                }
            })
            .catch((error) => {
                console.error('Failed to approve request:', error.message);
            });
    }

    // reject request handler
    function handleReject(requestId, row) {
        row.remove();  
        RoomRequestViewModel.updateRequestStatus(requestId, 'rejected')
            .then((response) => {
                if (response.message === "Room request updated successfully") {
                    console.log(response.message)
                } else {
                    console.error(`Failed to reject request ID ${requestId}:`, response.message);
                }
            })
            .catch((error) => {
                console.error('Failed to reject request:', error.message);
            });
    }
}
