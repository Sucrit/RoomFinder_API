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
        
        if ($roomRequests) {
            echo json_encode($roomRequests);
        } else {
            echo json_encode(['message' => 'No room requests found for this student']);
        }
    }

    public function getRoomRequests() {
        // Get the counts of room requests by status
        $statusCounts = $this->roomRequestModel->getRoomRequestsCountByStatus();
    
        // Get the recent pending requests created within the last 24 hours
        $recentRequests = $this->roomRequestModel->getRecentPendingRequests();
    
        // Get all pending room requests
        $allPendingRequests = $this->roomRequestModel->getAllPendingRoomRequests();
    
        // Return the status counts and the requests as a JSON response
        echo json_encode([
            'pending' => [
                'count' => (string)$statusCounts['pending'], // Ensure the count is a string
            ],
            'approved' => [
                'count' => (string)$statusCounts['approved'],
            ],
            'rejected' => [
                'count' => (string)$statusCounts['rejected'],
            ],
            'Recent request' => $recentRequests,
            'Room Request' => $allPendingRequests,
        ]);
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

    public function createRoomRequest($room_id, $student_id, $purpose, $starting_time, $ending_time) {
        $roomrequest = $this->roomRequestModel->createRoomRequest($room_id, $student_id, $purpose, $starting_time, $ending_time);
        if ($roomrequest) {
            echo json_encode(['Room Request' => $roomrequest]);
        } else {
            echo json_encode(['message' => 'Error creating room request']);
        }
    }
    
    public function deleteRoomRequest($id) {
        $this->roomRequestModel->deleteRoomRequest($id);
    }
}

?>
