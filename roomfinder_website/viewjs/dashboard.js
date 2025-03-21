
// dashboard section dom/M
import RoomRequestViewModel from "../viewmodel/roomrequestViewModel.js";
// import { showLoading, hideLoading } from "../viewjs/loading.js";

export async function InitDashboard() {

    // showLoading();

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

            const pendingRequestBox = document.getElementById('pendingRequestBox');
            const approvedRequestBox = document.getElementById('approvedRequestBox');
            const rejectedRequestBox = document.getElementById('rejectedRequestBox');
            // box bg
            if (pendingRequestBox) {
                pendingRequestBox.style.background = `linear-gradient(to right,rgb(251, 201, 126) ${pendingPercentage}%, #fff ${pendingPercentage}%)`;
            }
            if (approvedRequestBox) {
                approvedRequestBox.style.background = `linear-gradient(to right,rgb(151, 248, 151) ${approvedPercentage}%, #fff ${approvedPercentage}%)`;
            }
            if (rejectedRequestBox) {
                rejectedRequestBox.style.background = `linear-gradient(to right,rgb(252, 152, 152) ${rejectedPercentage}%, #fff ${rejectedPercentage}%)`;
            }

            // dom dashboard stats
            updateTextContent('totalRequests', totalRequests);
            updateTextContent('pendingRequests', data["pending count"] || 0);
            updateTextContent('pendingPercentage', pendingPercentage + '%');
            updateTextContent('approvedRequests', data["approved count"] || 0);
            updateTextContent('approvedPercentage', approvedPercentage + '%');
            updateTextContent('rejectedRequests', data["rejected count"] || 0);
            updateTextContent('rejectedPercentage', rejectedPercentage + '%');

            updateTextContent('totalRooms', totalRoom);
            updateTextContent('availableRooms', data["available count"] || 0);
            updateTextContent('availablePercentage', availablePercentage + '%');
            updateTextContent('occupiedRooms', data["occupied count"] || 0);
            updateTextContent('occupiedPercentage', occupiedPercentage + '%');
            updateTextContent('closedRooms', data["closed count"] || 0);
            updateTextContent('closedPercentage', closedPercentage + '%');

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
        // if (loadingSpinner) {
        //     loadingSpinner.style.display = 'none';  
        // }
        console.error('Error fetching dashboard details:', error);
        showError('Failed to load dashboard details.');
    }
    // finally {
    //     hideLoading();
    // }

    // Update progress bar width based on percentage
function updateProgressBar(requestBoxId, percentage) {
    const requestBox = document.getElementById(requestBoxId);
    const progressBar = requestBox.querySelector('.progress-bar');  // Assuming you have the actual progress bar div inside your box
    if (progressBar) {
        // Initially set the width to 0% (to make the animation work)
        progressBar.style.width = '0%';  
        
        // Trigger animation by setting the width to the calculated percentage
        setTimeout(() => {
            progressBar.style.width = `${percentage}%`;  // This will trigger the CSS animation
            progressBar.classList.add('animate-progress-bar');  // Add animation class
        }, 100); // Delay to ensure width change triggers the animation
    }
}

}

// update progress bar width base on percentage
function updateProgressBar(requestBoxId, percentage) {
    const requestBox = document.getElementById(requestBoxId);
    const progress = requestBox.querySelector('div'); 
    if (progress) {
        progress.style.width = `${percentage}%`;
    }
}


// utility update innertext with null check
function updateTextContent(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = text;
    }
}

// utility update
function updateTable(tableId, data) {
    const tableBody = document.getElementById(tableId).querySelector('tbody');
    tableBody.innerHTML = '';

    // limit to 5 items
    const limitedData = data.slice(0, 5); 

    if (Array.isArray(limitedData) && limitedData.length > 0) {
        limitedData.forEach(item => {
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



// see all buttonn
function InitSeeAllButton() {
    const seeRequestHistoryBtn = document.querySelector('.seerequesthistory-btn');
    if (seeRequestHistoryBtn) {
        seeRequestHistoryBtn.addEventListener('click', function() {
            showSection('pending_request');
        });
    }

    const seeOngoingSchedule = document.querySelector('.seeongoingschedule-btn');
    if (seeOngoingSchedule) {
        seeOngoingSchedule.addEventListener('click', function(){
            showSection('ongoing_schedule');
        });
    }
}   


// initial hide sec in dashboard
document.addEventListener('DOMContentLoaded', function() {

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