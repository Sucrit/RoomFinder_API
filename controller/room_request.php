<?php

require_once '../models/room_request.php';
require_once '../models/room.php';
require_once '../models/room_schedule.php';

class RoomRequestController {
    private $roomRequestModel;
    private $roomModel;
    private $roomScheduleModel;

    public function __construct() {
        $this->roomRequestModel = new RoomRequestModel();
        $this->roomModel = new RoomModel();
        $this->roomScheduleModel = new RoomScheduleModel();
    }
    
    // get all room requests of a specific student
    public function getRoomRequestsByStudent($userId) {
        $roomRequests = $this->roomRequestModel->getRoomRequestsByUser($userId);
        if ($roomRequests) {
            echo json_encode($roomRequests);
        } 
        else {
            echo json_encode(['message' => 'No room requests found for this student']);
        }
    }

    // get room request history (approved or rejected only)
    public function getRoomRequestHistory () {
        $requestHistory = $this->roomRequestModel->getRoomRequestHistory();
        echo json_encode(['Room Request History' => $requestHistory]);
    }

    // get all pending room request only
    public function getAllPendingRoomRequest () {
        $allPendingRequests = $this->roomRequestModel->getAllPendingRoomRequests();
        echo json_encode(['Pending Requests' => $allPendingRequests]);
    }

    public function getRoomRequests() {
        $requeststatusCounts = $this->roomRequestModel->getRoomRequestsCountByStatus();
        $roomstatusCounts = $this->roomModel->getRoomCountByStatus();
        $getAllRoomRequestsHistory = $this->roomRequestModel->getRoomRequestHistory();
        $getOngoingSchedules = $this->roomScheduleModel->getAllOngoingSchedules();

        echo json_encode([
            'pending count' => (string)$requeststatusCounts['Pending'],
            'approved count' => (string)$requeststatusCounts['Approved'],
            'rejected count' => (string)$requeststatusCounts['Rejected'],
            'available count' => (string)$roomstatusCounts['Available'],
            'occupied count' => (string)$roomstatusCounts['Occupied'],
            'closed count' => (string)$roomstatusCounts['Closed'],
            'Ongoing schedule' => $getOngoingSchedules,
            'Request history' => $getAllRoomRequestsHistory
        ]);
    }

    // get room request by id
    public function getRoomRequest($id) {
        $roomRequest = $this->roomRequestModel->getRoomRequestById($id);
        if ($roomRequest) {
            echo json_encode($roomRequest);
        } 
        else {
            echo json_encode(['message' => 'Room request not found']);
        }
    }

    public function createRoomRequest($room_id, $user_id, $block, $purpose, $date, $starting_time, $ending_time) {
        // check if room exist
        if ($this->roomModel->roomExists($room_id)) {
        // check if room schedule exist in a room
        $scheduleConflict = $this->roomScheduleModel->roomScheduleExist($room_id, $date, $starting_time, $ending_time);

        if ($scheduleConflict) {
            echo json_encode(['message' => 'The room is already occupied for your requested time slot']);
            return false;
        } 
        else {$roomrequest = $this->roomRequestModel->createRoomRequest($room_id, $user_id, $block, $purpose, $date, $starting_time, $ending_time);
            if ($roomrequest) {
                echo json_encode(['message' => 'Request sent successfully']);
            } 
            else {
                echo json_encode(['message' => 'Error creating room request']);
            }
        }
    }
    else {
        echo json_encode(['message' => 'Room not found']);
        }
    }
    
    // update room request status only
    public function updateRoomRequestStatus($id, $status) {
        $this->roomRequestModel->updateRoomRequestStatus($id, $status);
    }

    // delete room request
    public function deleteRoomRequest($id) {
        $this->roomRequestModel->deleteRoomRequest($id);
    }
}
?>
