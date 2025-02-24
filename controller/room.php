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
    public function getRooms() {
        $currentTime = date('H:i:s'); 
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
                    $startingTime = $schedule['starting_time'];
                    $endingTime = $schedule['ending_time'];

                    // time calculation
                    if ($currentTime >= $startingTime && $currentTime < $endingTime) {
                        $room['status'] = 'Occupied'; 
                        break;
                    }
                }
            }
            $room['schedule'] = $schedules;
    
            // Update room status
            if ($room['status'] == 'Occupied') {
                $updated = $this->roomModel->updateRoomStatus($room['id'], 'Occupied');
            } else {
                $updated = $this->roomModel->updateRoomStatus($room['id'], 'Available');
            }        
        }
    
        echo json_encode($rooms);
    }
    
    // create a new room
    public function createRoom($name, $status, $availability, $equipment, $capacity, $roomType) {
        if (isset($name, $status, $availability, $equipment, $capacity, $roomType)) {
            $result = $this->roomModel->createRoom($name, $status, $availability, $equipment, $capacity, $roomType);
            if (is_array($result)) {
                echo json_encode([
                    'message' => 'Room created successfully',
                    'Room Details' => $result
                ]);
            } else {
                echo json_encode([
                    'message' => $result,
                    'status' => '500'
                ]);
            }
        } else {
            echo json_encode([
                'message' => 'Missing required fields',
                'status' => '400'
            ]);
        }
    }

    // update room details
    public function updateRoom($id, $input) {
        $room = $this->roomModel->getRoomById($id);
        if (!$room) {
            echo json_encode(['message' => 'Room not found']);
            return;
        }

        $name = isset($input['name']) ? $input['name'] : $room['name'];
        $roomType = isset($input['room_type']) ? $input['room_type'] : $room['room_type'];
        $capacity = isset($input['capacity']) ? $input['capacity'] : $room['capacity'];
        $status = isset($input['status']) ? $input['status'] : $room['status'];
        $availability = isset($input['availability']) ? $input['availability'] : $room['availability'];
        $equipment = isset($input['equipment']) ? $input['equipment'] : $room['equipment'];

        $this->roomModel->updateRoom($id, $name, $roomType, $capacity, $status, $availability, $equipment);
        echo json_encode(['message' => 'Room updated suucessfully']);
    }

    // delete room and room request
    public function deleteRoomById($id) {
        $this->roomModel->deleteRoom($id);
        echo json_encode(['message' => 'Room has been deleted']);
    }    
}

?>
