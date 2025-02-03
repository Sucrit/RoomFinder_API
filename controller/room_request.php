<?php

require_once '../models/room_request.php';

class RoomRequestController {
    private $roomRequestModel;

    public function __construct() {
        $this->roomRequestModel = new RoomRequestModel();
    }

    // Get all room requests
    public function getRoomRequests() {
        $roomRequests = $this->roomRequestModel->getAllRoomRequests();
        echo json_encode($roomRequests);
    }

    // Get a room request by ID
    public function getRoomRequest($id) {
        $roomRequest = $this->roomRequestModel->getRoomRequestById($id);
        if ($roomRequest) {
            echo json_encode($roomRequest);
        } else {
            echo json_encode(['message' => 'Room request not found']);
        }
    }

    // Create a room request
    public function createRoomRequest($id, $student_id, $purpose, $starting_time, $ending_time, $receiver) 
    {
        $this->roomRequestModel->createRoomRequest($id, $student_id, $purpose, $starting_time, $ending_time, $receiver);
    }

    // Update a room request
    public function updateRoomRequest($id, $room_id, $student_id, $purpose, $starting_time, $ending_time, $receiver) {
        $this->roomRequestModel->updateRoomRequest($id, $room_id, $student_id, $purpose, $starting_time, $ending_time, $receiver);
    }

    // Delete a room request
    public function deleteRoomRequest($id) {
        $this->roomRequestModel->deleteRoomRequest($id);
    }
}

?>
