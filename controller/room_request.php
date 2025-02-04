<?php

require_once '../models/room_request.php';

class RoomRequestController {
    private $roomRequestModel;

    public function __construct() {
        $this->roomRequestModel = new RoomRequestModel();
    }

    // get all pending room requests
    public function getRoomRequests() {
        $roomRequests = $this->roomRequestModel->getAllRoomRequests();
        echo json_encode($roomRequests);
    }

    // get a pending room request by id
    public function getRoomRequest($id) {
        $roomRequest = $this->roomRequestModel->getRoomRequestById($id);
        if ($roomRequest) {
            echo json_encode($roomRequest);
        } else {
            echo json_encode(['message' => 'Room request not found']);
        }
    }

    public function createRoomRequest($id, $student_id, $purpose, $starting_time, $ending_time, $receiver) 
    {
        $this->roomRequestModel->createRoomRequest($id, $student_id, $purpose, $starting_time, $ending_time, $receiver);

    }

    public function deleteRoomRequest($id) {
        $this->roomRequestModel->deleteRoomRequest($id);
    }
}

?>
