<?php

require_once '../models/room_schedule.php';
require_once '../models/room.php';

class RoomScheduleController {
    private $roomScheduleModel;
    private $roomModel;

    public function __construct() {
        $this->roomScheduleModel = new RoomScheduleModel();
        $this->roomModel = new RoomModel();
    }

    // get all room schedule
    public function getAllRoomSchedule() {
        $roomschedule = $this->roomScheduleModel->getAllRoomSchedule();

        if (empty($roomschedule)) {
            echo json_encode(['message' => 'Room Schedule is empty']);
        } else {
            echo json_encode($roomschedule);
        }
    }


    // get all ongoing schedule
    public function getAllOngoingSchedules() {
        $ongoingSchedules = $this->roomScheduleModel->getAllOngoingSchedules();
    
        if (empty($ongoingSchedules)) {
            echo json_encode(['message' => 'No ongoing schedules found']);
            return;
        }
        echo json_encode($ongoingSchedules);
    }
    
    // get a room schedule by ID
    public function getRoomSchedule($id) {
        $roomSchedule = $this->roomScheduleModel->getRoomScheduleById($id);
        if ($roomSchedule) {
            echo json_encode($roomSchedule);
        } else {
            echo json_encode(['message' => 'Room schedule not found']);
        }
    }

    // get room schedule by room id
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

    // create room schedule
    public function createRoomSchedule($room_id, $block, $date, $starting_time, $ending_time) {
        // check if the room exists
        if ($this->roomModel->roomExists($room_id)) {
            // check room schedule conflict
            $scheduleConflict = $this->roomScheduleModel->roomScheduleExist($room_id, $date, $starting_time, $ending_time);
            
            if ($scheduleConflict) {
                echo json_encode(['message' => 'The room is already occupied for your requested time slot']);
            } else {
                $roomschedule = $this->roomScheduleModel->createRoomSchedule($room_id, $block, $date, $starting_time, $ending_time);
        
                if ($roomschedule) {
                    echo json_encode(['message' => 'Room schedule created successfully']); 
                } else {
                    echo json_encode(['message' => 'Error creating room schedule']);
                }
            }
        } else {
            echo json_encode(['message' => 'Room not found']);
        }
    }

    // update room schedule
    public function updateRoomSchedule($id, $input) {
        $schedule = $this->roomScheduleModel->getRoomScheduleById($id);
    
        if (!$schedule) {
            echo json_encode(['message' => 'Schedule not found']);
            return;
        }
        $room_id = isset($input['room_id']) ? $input['room_id'] : $schedule['room_id'];
        $block = isset($input['block']) ? $input['block'] : $schedule['block'];
        $date = isset($input['date']) ? $input['date'] : $schedule['date'];
        $starting_time = isset($input['starting_time']) ? $input['starting_time'] : $schedule['starting_time'];
        $ending_time = isset($input['ending_time']) ? $input['ending_time'] : $schedule['ending_time'];

        $this->roomScheduleModel->updateRoomSchedule($id, $room_id, $block, $date, $starting_time, $ending_time);
        echo json_encode(['message' => "Updated Successfully"]);
    }

    // delete room schedule
    public function deleteRoomSchedule($id) {
        $this->roomScheduleModel->deleteRoomSchedule($id);
    }

}
?>