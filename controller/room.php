<?php

require_once '../models/room.php';

 class RoomController{
    private $roomModel;

    public function __construct() {
        $this->roomModel = new RoomModel();
    }

     // Get a specific room by its ID
     public function getRoom($id) {
        $room = $this->roomModel->getRoomById($id); // Make sure to query by ID
        
        if (empty($room)) {
            echo json_encode(['message' => 'Room not found']);
        } else {
            echo json_encode($room);
        }
    }

    // Get all rooms
    public function getRooms() {
        $rooms = $this->roomModel->getAllRoom(); // Query for all rooms
        
        if (empty($rooms)) {
            echo json_encode(['message' => 'No rooms found']);
        } else {
            echo json_encode($rooms);
        }
    }
    // Create a room
    public function createRoom($roomName, $roomType, $capacity) {
        echo $this->roomModel->createRoom($roomName, $roomType, $capacity);
    }

    // Update room details
    public function updateRoom($id, $roomName, $roomType, $capacity) {
        echo $this->roomModel->updateRoom($id, $roomName, $roomType, $capacity);
    }

    // Delete a room
    public function deleteRoom($id) {
        echo $this->roomModel->deleteRoom($id);
    }
 }
?>