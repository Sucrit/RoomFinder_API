<?php

require_once '../models/room_schedule.php';

class RoomScheduleController {
    private $roomScheduleModel;

    public function __construct() {
        $this->roomScheduleModel = new RoomScheduleModel();
    }

    // Get a room schedule by ID
    public function getRoomSchedule($id) {
        $roomSchedule = $this->roomScheduleModel->getRoomScheduleById($id);
        if ($roomSchedule) {
            echo json_encode($roomSchedule);
        } else {
            echo json_encode(['message' => 'Room schedule not found']);
        }
    }

    // Get all room schedules
    public function getRoomSchedules() {
        $roomSchedules = $this->roomScheduleModel->getAllRoomSchedules();
        echo json_encode($roomSchedules);
    }

    // Create a room schedule
    public function createRoomSchedule($room_id, $starting_time, $ending_time) {
        $this->roomScheduleModel->createRoomSchedule($room_id, $starting_time, $ending_time);
    }

    // Update a room schedule
    public function updateRoomSchedule($id, $room_id, $starting_time, $ending_time) {
        $this->roomScheduleModel->updateRoomSchedule($id, $room_id, $starting_time, $ending_time);
    }

    // Delete a room schedule
    public function deleteRoomSchedule($id) {
        $this->roomScheduleModel->deleteRoomSchedule($id);
    }
}
?>