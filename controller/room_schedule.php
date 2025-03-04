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

    public function getRoomSchedulesOfRoom($roomId) {
        if ($roomId) {
            $roomSchedules = $this->roomScheduleModel->getSchedulesByRoomId($roomId);
            if (empty($roomSchedules)) {
                echo json_encode(['message' => 'Empty room schedules']);
            } else {
                echo json_encode(['Room Schedules' => $roomSchedules]);
            }
        } else {
            echo json_encode(['message' => 'Room ID is required']);
        }
    }

    public function createRoomSchedule($room_id, $block, $date, $starting_time, $ending_time) {
        // check if the room exists
        if ($this->roomScheduleModel->roomExists($room_id)) {
            
            $this->roomScheduleModel->createRoomSchedule($room_id, $block, $date, $starting_time, $ending_time);
        } else {
            echo json_encode(['message' => 'The room does not exist']);
        }
    }


    public function updateRoomSchedule($id, $room_id, $block, $date, $starting_time, $ending_time) {
        $this->roomScheduleModel->updateRoomSchedule($id, $room_id, $block, $date, $starting_time, $ending_time);
    }

    public function deleteRoomSchedule($id) {
        $this->roomScheduleModel->deleteRoomSchedule($id);
    }
}
?>