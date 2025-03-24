import RoomScheduleModel from "../model/roomscheduleModel.js";

export default class RoomScheduleViewModel {

    // get all room schedules
    static async getAllRoomSchedules() {
        try {
            const response = await RoomScheduleModel.getRoomSchedules();
            console.log(response); 
    
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

    // get all ongoing room schedules
    static async getOngoingSchedules() {
        try {
            const response = await RoomScheduleModel.getOngoingSchedules();
            console.log(response);

            if (Array.isArray(response) && response.length > 0) {
                return { success: true, ongoingSchedules: response };
            } else {
                return { success: true, ongoingSchedules: [] };
            }
        } catch (error) {
            console.error('Error fetching ongoing room schedules:', error);
            return { success: false, message: 'Error fetching ongoing room schedules' };
        }
    }

    // create room schedule
    static async createRoomSchedule(scheduleData) {
        try {
            const response = await RoomScheduleModel.createRoomSchedule(scheduleData);

            if (response.success) {
                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error creating room schedule:', error);
            return { success: false, message: 'Error creating room schedule' };
        }
    }

    // update room schedule
    static async updateRoomSchedule(id, scheduleData) {
        try {
            const response = await RoomScheduleModel.updateRoomSchedule(id, scheduleData);

            if (response.success) {
                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error updating room schedule:', error);
            return { success: false, message: 'Error updating room schedule' };
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
