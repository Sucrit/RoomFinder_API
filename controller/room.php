<?php

require_once '../models/room.php';
require_once '../models/room_schedule.php'; 

class RoomController {
    private $roomModel;
    private $roomScheduleModel;

    public function __construct() {
        $this->roomModel = new RoomModel();
        $this->roomScheduleModel = new RoomScheduleModel(); 
    }

    //  get room by id
    public function getRoom($id) {
        $room = $this->roomModel->getRoomById($id);
        
        if (empty($room)) {
            echo json_encode(['message' => 'Room not found']);
        } else {
            $schedules = $this->roomScheduleModel->getSchedulesByRoomId($id);
            $room['schedule'] = $schedules; 

            echo json_encode($room);
        }
    }

    // get all rooms
    public function getRooms() {
        $currentTime = date('H:i:s');  
        $currentDate = date('Y-m-d');   
        $rooms = $this->roomModel->getAllRoom();
    
        if (empty($rooms)) {
            echo json_encode(['message' => 'No rooms found']);
            return;
        }
    
        foreach ($rooms as &$room) {
            $schedules = $this->roomScheduleModel->getSchedulesByRoomId($room['id']);
            $room['status'] = 'Available'; 
            
            if (!empty($schedules)) {
                foreach ($schedules as $schedule) {
                    $scheduleDate = $schedule['date'];
                    $startingTime = $schedule['starting_time'];
                    $endingTime = $schedule['ending_time'];
    
                    // check if the current date and time is within the scheduled time range
                    if ($currentDate === $scheduleDate && $currentTime >= $startingTime && $currentTime < $endingTime) {
                        // set status to occupied if the room is within the time range
                        $room['status'] = 'Occupied'; 
                        break;
                    }
                }
            }
    
            $room['schedules'] = $schedules;
    
            // update room status whether its occupied
            if ($room['status'] == 'Occupied') {
                $this->roomModel->updateRoomStatus($room['id'], 'Occupied');
            } else {
                $this->roomModel->updateRoomStatus($room['id'], 'Available');
            }
        }
        echo json_encode(["Room List" => $rooms]);
    }
    
    // create room
    public function createRoom($room_building, $room_number, $status, $equipment, $capacity, $roomType) {
        $room = $this->roomModel->createRoom($room_building, $room_number, $status, $equipment, $capacity, $roomType);
        if ($room) {
            echo json_encode($room);
        } else {
            echo json_encode(['message' => 'Room creation failed']);
        }
    }

    // update room details
    public function updateRoom($id, $input) {
        $room = $this->roomModel->getRoomById($id);
        if (!$room) {
            echo json_encode(['message' => 'Room not found']);
            return;
        }

        $room_building = isset($input['room_building']) ? $input['room_building'] : $room['room_building'];
        $room_number = isset($input['room_number']) ? $input['room_number'] : $room['room_number'];
        $roomType = isset($input['room_type']) ? $input['room_type'] : $room['room_type'];
        $capacity = isset($input['capacity']) ? $input['capacity'] : $room['capacity'];
        $status = isset($input['status']) ? $input['status'] : $room['status'];
        $equipment = isset($input['equipment']) ? $input['equipment'] : $room['equipment'];

        $this->roomModel->updateRoom($id, $room_building, $room_number, $roomType, $capacity, $status, $equipment);
        echo json_encode(['message' => 'Room updated sucessfully']);
    }

    // search room
    public function searchRooms($input) {
        if (isset($_GET['keyword'])) {
            $keyword = $_GET['keyword'];
            $rooms = $this->roomModel->searchRooms($keyword);
    
            if (empty($rooms)) {
                echo json_encode(['message' => 'No rooms found for the keyword']);
            } else {
                echo json_encode($rooms);
            }
        } else {
            echo json_encode(['message' => 'Keyword is required']);
        }
    }
    
    // delete room
    public function deleteRoomById($id) {
        $this->roomModel->deleteRoom($id);
        echo json_encode(['message' => 'Room has been deleted']);
    }    
}
?>
