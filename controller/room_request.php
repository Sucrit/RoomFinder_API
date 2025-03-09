<?php

require_once '../models/room_request.php';

class RoomRequestController {
    private $roomRequestModel;

    public function __construct() {
        $this->roomRequestModel = new RoomRequestModel();
    }
    
    // get all room requests of a specific student
    public function getRoomRequestsByStudent($userId) {
        $roomRequests = $this->roomRequestModel->getRoomRequestsByUser($userId);
        if ($roomRequests) {
            echo json_encode($roomRequests);
        } else {
            echo json_encode(['message' => 'No room requests found for this student']);
        }
    }

    public function getRoomRequests() {
        // count via status value
        $statusCounts = $this->roomRequestModel->getRoomRequestsCountByStatus();
        // get all pending request
        $allPendingRequests = $this->roomRequestModel->getAllPendingRoomRequests();
        // get all room request
        $allRoomRequests = $this->roomRequestModel->getAllRoomRequests();
        
        echo json_encode([
            'pending count' => (string)$statusCounts['pending'],
            'approved count' => (string)$statusCounts['approved'],
            'rejected count' => (string)$statusCounts['rejected'],
            'Room Requests' => $allRoomRequests,
            'Pending Request' => $allPendingRequests
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
        // execute room schedule exist in room request model first
        $scheduleConflict = $this->roomRequestModel->roomScheduleExist($room_id, $date, $starting_time, $ending_time);
    
        if ($scheduleConflict) {
            echo json_encode(['message' => 'The room is already occupied for your requested time slot']);
        } else {
            // create room request
            $roomrequest = $this->roomRequestModel->createRoomRequest($room_id, $user_id, $block, $purpose, $date, $starting_time, $ending_time);
            if ($roomrequest) {
                echo json_encode($roomrequest);
            } else {
                echo json_encode(['message' => 'Error creating room request']);
            }
        }
    }
    
    public function deleteRoomRequest($id) {
        $this->roomRequestModel->deleteRoomRequest($id);
        echo json_encode(['message' => 'Room request deleted successfully']);
    }
}
?>
