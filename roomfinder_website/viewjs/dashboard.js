
// dashboard section dom/M
import RoomRequestViewModel from "../viewmodel/roomrequestViewModel.js";

export async function InitDashboard() {
    try {
        const response = await RoomRequestViewModel.getDashboardDetails();

        if (response.success) {
            const data = response.history || {};

            // room requeest stats fallback
            const pendingCount = parseInt(data["pending count"]) || 0;
            const approvedCount = parseInt(data["approved count"]) || 0;
            const rejectedCount = parseInt(data["rejected count"]) || 0;

            const totalRequests = pendingCount + approvedCount + rejectedCount;
            const pendingPercentage = totalRequests ? ((pendingCount / totalRequests) * 100).toFixed(2) : '0.00';
            const approvedPercentage = totalRequests ? ((approvedCount / totalRequests) * 100).toFixed(2) : '0.00';
            const rejectedPercentage = totalRequests ? ((rejectedCount / totalRequests) * 100).toFixed(2) : '0.00';

            // room details stats fallback
            const availableCount = parseInt(data["available count"]) || 0;
            const occupiedCount = parseInt(data["occupied count"]) || 0;
            const closedCount = parseInt(data["closed count"]) || 0;

            const totalRoom = availableCount + occupiedCount + closedCount;
            const availablePercentage = totalRoom ? ((availableCount / totalRoom) * 100).toFixed(2) : '0.00';
            const occupiedPercentage = totalRoom ? ((occupiedCount / totalRoom) * 100).toFixed(2) : '0.00';
            const closedPercentage = totalRoom ? ((closedCount / totalRoom) * 100).toFixed(2) : '0.00';

            // dom dashboard stats
            document.getElementById('totalRequests').innerText = totalRequests;
            document.getElementById('pendingRequests').innerText = data["pending count"] || 0;
            document.getElementById('pendingPercentage').innerText = pendingPercentage + '%';
            document.getElementById('approvedRequests').innerText = data["approved count"] || 0;
            document.getElementById('approvedPercentage').innerText = approvedPercentage + '%';
            document.getElementById('rejectedRequests').innerText = data["rejected count"] || 0;
            document.getElementById('rejectedPercentage').innerText = rejectedPercentage + '%';

            document.getElementById('totalRooms').innerText = totalRoom;
            document.getElementById('availableRooms').innerText = data["available count"] || 0;
            document.getElementById('availablePercentage').innerText = availablePercentage + '%';
            document.getElementById('occupiedRooms').innerText = data["occupied count"] || 0;
            document.getElementById('occupiedPercentage').innerText = occupiedPercentage + '%';
            document.getElementById('closedRooms').innerText = data["closed count"] || 0;
            document.getElementById('closedPercentage').innerText = closedPercentage + '%';

            // ongoing schedules table 
            const ongoingScheduleData = data["Ongoing schedule"] || [];
            updateTable('ongoingSchedule', ongoingScheduleData);

            // request history table
            const requestHistoryData = data["Request history"] || [];
            updateTable('requestHistory', requestHistoryData);

            // init btns in dashboard
            InitSeeAllButton();
        } 
        else {
            console.error('Error:', response.message);
            showError(response.message);
        }
    } 
    catch (error) {
        console.error('Error fetching dashboard details:', error);
        showError('Failed to load dashboard details.');
    }
}

// utility update
function updateTable(tableId, data) {
    const tableBody = document.getElementById(tableId).querySelector('tbody');
    tableBody.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
            const row = document.createElement('tr');

            // ongoing schedule (dashboard)
            if (tableId === 'ongoingSchedule') {
                row.innerHTML = `
                    <td>${item.room_building || 'N/A'}</td> 
                    <td>${item.room_number || 'N/A'}</td>   
                    <td>${item.block || 'N/A'}</td>        
                    <td>${item.date || 'N/A'}</td>     
                    <td>${item.starting_time || 'N/A'}</td>
                    <td>${item.ending_time || 'N/A'}</td>   
                `;
            } 
            // request history (dashboard)
            else if (tableId === 'requestHistory') {
                row.innerHTML = `
                    <td>${item.username || 'N/A'}</td>  
                    <td>${item.block || 'N/A'}</td>     
                    <td>${item.date || 'N/A'}</td>       
                    <td>${item.starting_time || 'N/A'}</td> 
                    <td>${item.ending_time || 'N/A'}</td>  
                `;
            }

            tableBody.appendChild(row);  
        });
    } 
    else {
        let noDataMessage = '<td colspan="6">No data available</td>';

        // create row
        const row = document.createElement('tr');
        row.innerHTML = noDataMessage;
        tableBody.appendChild(row);
    }
}
function InitSeeAllButton() {
    const seeRequestHistoryBtn = document.querySelector('.seerequesthistory-btn');
    if (seeRequestHistoryBtn) {
        seeRequestHistoryBtn.addEventListener('click', function() {
            showSection('request_history');
        });
    }

    const seeOngoingSchedule = document.querySelector('.seeongoingschedule-btn');
    if (seeOngoingSchedule) {
        seeOngoingSchedule.addEventListener('click', function(){
            showSection('ongoing_schedule');
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // initially hide section
    const ongoingScheduleSection = document.getElementById('ongoing_schedule');
    const requestHistorySection = document.getElementById('request_history');

    if (ongoingScheduleSection) {
        ongoingScheduleSection.classList.add('hidden');
    }
    if (requestHistorySection) {
        requestHistorySection.classList.add('hidden');
    }

    // init see all btn
    InitSeeAllButton();
});