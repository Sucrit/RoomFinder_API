
import RoomModel from '../model/roomModel.js';

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
            return { success: false, message: 'Error fetching rooms' };
        }
    }

    // get room by id 
    static async getRoomById(roomId) {
        try {
            const room = await RoomModel.getRoomById(roomId);  // Call API to get room data
            if (room && room.success) {   // Check if the room data is returned successfully
                return { success: true, room: room.room };  // Ensure you're returning room data in the right format
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
            // Call the Model to create the room
            const response = await RoomModel.createRoom(roomData);

            if (response.success) {
                return { success: true, room: response.room }; // Return success and room data
            } else {
                return { success: false, message: 'Error creating room' }; // Return error if something goes wrong
            }
        } catch (error) {
            console.error('Error in ViewModel during room creation:', error);
            return { success: false, message: 'Error creating room' }; // Handle unexpected errors
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
                console.log('Room deleted successfully');
                return { success: true, message: 'Room deleted successfully' }; 
            } else {
                return { success: false, message: 'Error deleting room' };
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            return { success: false, message: 'Error deleting room' };
        }
    }
}
