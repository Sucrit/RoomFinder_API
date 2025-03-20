import RoomScheduleModel from "../model/roomscheduleModel.js";

export default class RoomScheduleViewModel {
    // get all room schedules
    static async getAllRoomSchedules() {
        try {
            const response = await RoomScheduleModel.getRoomSchedules();
            console.log(response); 
    
            // Assuming the response is an array of schedules
            if (Array.isArray(response) && response.length >= 0) {
                return { success: true, schedules: response };
            } else {
                return { success: true, schedules: [] };
            }
        } catch (error) {
            console.error('Error fetching room schedules:', error);
            return { success: false, message: 'Error fetching room schedules' };
        }
    }

     // delete a room schedule
     static async deleteRoomSchedule(id) {
        try {
            const message = await RoomScheduleModel.deleteRoomSchedule(id);
            if (message) {
                return { success: true, message };
            } else {
                return { success: false, message: 'Failed to delete room schedule' };
            }
        } catch (error) {
            console.error('Error deleting room schedule:', error);
            return { success: false, message: 'Failed to delete room schedule' };
        }
    }
}
