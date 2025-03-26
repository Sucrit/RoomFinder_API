import { authorizationRole } from './2auth.js';

export default class RoomScheduleModel {

    // get room schedules (room schedule section)
    static getRoomSchedules() {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error("You are not authorized");
        }

        return fetch('http://localhost/RoomFinder_API/api/index.php/room_schedule', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            console.log('Response status:', response.status);  
            if (!response.ok) {
                console.error('Error response:', response);  
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching room schedules:', error.message); 
            return [];  
        });
    }

    // get all ongoing schedule route
    static getOngoingSchedules() {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error("You are not authorized");
        }

        return fetch('http://localhost/RoomFinder_API/api/index.php/room_schedule/ongoing_schedule', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                console.error('Error response:', response);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching ongoing schedules:', error.message);
            return [];
        });
    }

    // create room schedule route
    static async createRoomSchedule(scheduleData) {
        const authToken = localStorage.getItem('authToken'); 
    
        if (!authToken) {
            throw new Error("You are not authorized");
        }

        // check user role
        const userRole = authorizationRole(); 
        if (userRole !== 'Administrator') { 
            return { success: false, message: 'Only Administrator can perform this action' }; 
        }
    
        const response = await fetch('http://localhost/RoomFinder_API/api/index.php/room_schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(scheduleData),
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
    
        if (data.status === 'success') {
            return { success: true, message: data.message, status: data.status }; 
        } else if (data.status === 'error') {
            return { success: false, message: data.message, status: data.status };
        } else {
            throw new Error('Unexpected response from the server');
        }
    }

    // update room schedule route
    static async updateRoomSchedule(id, scheduleData) {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error("You are not authorized");
        }

        // check user role
        const userRole = authorizationRole(); 
        if (userRole !== 'Administrator') { 
            return { success: false, message: 'Only Administrator can perform this action' }; 
        }

        const response = await fetch(`http://localhost/RoomFinder_API/api/index.php/room_schedule/${id}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(scheduleData), 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
            return { success: true, message: data.message };
        } else {
            throw new Error('Failed to update room schedule');
        }
    }
    
    // delete room schedule route
    static deleteRoomSchedule(id) {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error("You are not authorized");
        }

        // check user role
        const userRole = authorizationRole(); 
        if (userRole !== 'Administrator') { 
            return { success: false, message: 'Only Administrator can perform this action' }; 
        }

        return fetch(`http://localhost/RoomFinder_API/api/index.php/room_schedule/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                return { success: true, message: data.message, status: data.status };
            } else if (data.status === 'error') {
                return { success: false, message: data.message, status: data.status };
            }
        })
        .catch(error => {
            console.error('Error deleting room schedule:', error);
            return 'Failed to delete room schedule';
        });
    }
}
