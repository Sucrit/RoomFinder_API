
import RoomModel from '../model/roomModel.js';
import { showToast } from '../viewjs/toast.js';

export default class RoomViewModel {

    // get all room (room section)
    static async getAllRooms() {
        try {
            const response = await RoomModel.getRoomList();

            if (Array.isArray(response) && response.length > 0) {
                return { success: true, rooms: response };
            } else {
                return { success: true, rooms: []};
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            showToast('Error fetching rooms', 'error');
            return { success: false, message: 'Error fetching rooms' };
        }
    }


    // get room by id 
    static async getRoomById(roomId) {
        try {
            const room = await RoomModel.getRoomById(roomId);  
            if (room && room.success) {   
                return { success: true, room: room.room };  
            }
            return { success: false, message: 'Room not found or invalid' };
        } catch (error) {
            console.error('Error fetching room:', error);
            return { success: false, message: 'Error fetching room details' };
        }
    }

    // create room
    static async createRoom(roomData) {
        try {
            console.log('Room Data Being Sent:', roomData);  
            const response = await RoomModel.createRoom(roomData);

            console.log('Response from RoomModel:', response); 
    
            if (response.success) {
                showToast('Room added successfully!', 'success');
                console.log('Room created successfully. Room ID:', response.room.id);  
                return { success: true, room: response.room };
            } else {
                showToast(response.message || 'Error creating room', 'error');
                return { success: false, message: 'Error creating room' };
            }
        } catch (error) {
            console.error('Error in ViewModel during room creation:', error);
            showToast('Error creating room', 'error');
            return { success: false, message: 'Error creating room' };
        }
    }
    


    // update room
    static async updateRoom(roomId, updatedData) {
        try {
            const response = await RoomModel.updateRoom(roomId, updatedData);
            if (response.success) {
                return { success: true, room: response.room };
            } else {
                return { success: false, message: 'Error updating room' };
            }
        } catch (error) {
            console.error('Error updating room:', error);
            return { success: false, message: 'Error updating room' };
        }
    }    
    
    
    // delete room by id
    static async deleteRoom(roomId) {
        try {
            const response = await RoomModel.deleteRoomById(roomId); 
            if (response.success) {
                showToast('Room deleted successfully', 'success');
                return { success: true, message: 'Room deleted successfully' }; 
            } else {
                showToast('Error deleting room', 'error');
                return { success: false, message: 'Error deleting room' };
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            showToast('Error deleting room', 'error');
            return { success: false, message: 'Error deleting room' };
        }
    }
}
