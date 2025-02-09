<?php

require_once '../models/room.php';

 class RoomController{
    private $roomModel;

    public function __construct() {
        $this->roomModel = new RoomModel();
    }

     // Get room by ID
     public function getRoom($id) {
        $room = $this->roomModel->getRoomById($id);
        
        if (empty($room)) {
            echo json_encode(['message' => 'Room not found']);
        } else {
            echo json_encode($room);
        }
    }

    // Get all rooms
    public function getRooms() {
        $rooms = $this->roomModel->getAllRoom();
        if (empty($rooms)) {
            echo json_encode(['message' => 'No rooms found']);
        } else {
            echo json_encode($rooms);
        }
    }
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

    $updateResult = $this->roomModel->updateRoom($id, $name, $roomType, $capacity, $status, $availability, $equipment);

    echo $updateResult;
}
    public function deleteRoom($id) {
        echo $this->roomModel->deleteRoom($id);
    }
 }
?>