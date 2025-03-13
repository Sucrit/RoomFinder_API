import RoomRequestViewModel from '../viewmodel/roomrequestViewModel.js';

document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard loaded!');
    
    // Check if the dashboard section is currently visible
    if (document.getElementById('dashboard') && !document.getElementById('dashboard').classList.contains('hidden')) {
        RoomRequestViewModel.loadRoomRequests();  // Calls the loadRoomRequests method from the ViewModel
        console.log('Loading dashboard activity...');
    }
});
