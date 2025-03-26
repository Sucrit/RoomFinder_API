
import RoomScheduleModel from "../model/roomscheduleModel.js";
import { showToast } from '../viewjs/toast.js';

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
        const response = await RoomScheduleModel.createRoomSchedule(scheduleData);

        if (response.success) {
            showToast(response.message, 'success');
            return { success: true, message: response.message, status: response.status };
        } else {
            showToast(response.message, 'error');
            return { success: false, message: response.message, status: response.status };
        }     
    }


    // update room schedule
    static async updateRoomSchedule(id, scheduleData) {
        const response = await RoomScheduleModel.updateRoomSchedule(id, scheduleData);

        if (response.success) {
            showToast(response.message, 'success');
            return { success: true, message: response.message };
        } else {
            showToast(response.message, 'error');
            return { success: false, message: response.message };
        }
    }
    

    // delete a room schedule
    static async deleteRoomSchedule(id) {
        const response = await RoomScheduleModel.deleteRoomSchedule(id);

        if (response.success) {
            showToast(response.message, 'success');
            return { success: true, message: response.message };
        } else {
            showToast(response.message, 'error');
            return { success: false, message: response.message };
        }
    }
}
