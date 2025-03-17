
import RoomModel from '../model/roomModel.js';

export default class RoomViewModel {

    // get all room (room section)
    static async getAllRooms() {
        try {
            const response = await RoomModel.getRoomList();

            if (Array.isArray(response) && response.length > 0) {
                return { success: true, rooms: response };
            } else {
                return { success: false, message: 'No rooms found in the response' };
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            return { success: false, message: 'Error fetching rooms' };
        }
    }

    // delete room by id (room section)
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
