<?php

require_once '../models/room_request.php';

class RoomRequestController {
    private $roomRequestModel;

    public function __construct() {
        $this->roomRequestModel = new RoomRequestModel();
    }
    // get all room requests of a specific student
    public function getRoomRequestsByStudent($studentId) {
        $roomRequests = $this->roomRequestModel->getRoomRequestsByStudent($studentId);

        // If room requests found, return them, else return a not found message
        if ($roomRequests) {
            echo json_encode($roomRequests);
        } else {
            echo json_encode(['message' => 'No room requests found for this student']);
        }
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
        $roomrequest = $this->roomRequestModel->createRoomRequest($id, $student_id, $purpose, $starting_time, $ending_time, $receiver);
        if ($roomrequest){
            echo json_encode(['Room Request' => $roomrequest]);
        }
    }

    public function deleteRoomRequest($id) {
        $this->roomRequestModel->deleteRoomRequest($id);
    }
}

?>
