<?php

require_once '../models/room_request.php';

class RoomRequestController {
    private $roomRequestModel;

    public function __construct() {
        $this->roomRequestModel = new RoomRequestModel();
    }
    
    // get all room requests of a specific student
    public function getRoomRequestsByStudent($userId) {
        $roomRequests = $this->roomRequestModel->getRoomRequestsByStudent($userId);
        if ($roomRequests) {
            echo json_encode($roomRequests);
        } else {
            echo json_encode(['message' => 'No room requests found for this student']);
        }
    }

    public function getRoomRequests() {
        // count via status value
        $statusCounts = $this->roomRequestModel->getRoomRequestsCountByStatus();
        // get recent request
        $recentRequests = $this->roomRequestModel->getRecentPendingRequests();
        // get all request
        $allPendingRequests = $this->roomRequestModel->getAllPendingRoomRequests();
        
        echo json_encode([
            'pending' => [
                'count' => (string)$statusCounts['pending'],
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

    public function createRoomRequest($room_id, $user_id, $block, $purpose, $date, $starting_time, $ending_time) {
        $roomrequest = $this->roomRequestModel->createRoomRequest($room_id, $user_id, $block, $purpose, $date,$starting_time, $ending_time);
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
