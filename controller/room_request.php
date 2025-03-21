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
            echo json_encode(['status' => 'error', 'message' => 'No room requests found for this student']);
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

    // get dashboard details (web)
    public function getRoomRequests() {

        $requeststatusCounts = $this->roomRequestModel->getRoomRequestsCountByStatus();
        $roomstatusCounts = $this->roomModel->getRoomCountByStatus();

        $getAllRoomRequestsHistory = $this->roomRequestModel->getAllPendingRoomRequests();
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
            echo json_encode(['status' => 'error', 'message' => 'Room request not found']);
        }
    }

    // create room request
    public function createRoomRequest($room_id, $user_id, $block, $purpose, $date, $starting_time, $ending_time) {

        // get current time
        $currentTimestamp = time();

        // combine date to starting time & ending time
        $requestedStartTimestamp = strtotime("$date $starting_time");
        $requestedEndTimestamp = strtotime("$date $ending_time");

        // check time conflict
        if ($requestedStartTimestamp < $currentTimestamp || $requestedEndTimestamp < $currentTimestamp) {
            echo json_encode(['status' => 'error', 'message' => 'The requested time is invalid, Try again']);
            return;
        }

        // check if the room exists
        if ($this->roomModel->roomExists($room_id)) {
    
            // get status
            $room = $this->roomModel->getRoomById($room_id);
            
            // check if the room is closed
            if ($room['status'] === 'Closed') {
                echo json_encode(['status' => 'error', 'message' => 'This room is closed']);
                return;
            }
    
            // check schedule conflict
            $scheduleConflict = $this->roomScheduleModel->roomScheduleExist($room_id, $date, $starting_time, $ending_time);
    
            if ($scheduleConflict) {
                echo json_encode(['status' => 'error', 'message' => 'The room is already occupied for your requested time slot']);
                return;
            } else {
                
                $roomrequest = $this->roomRequestModel->createRoomRequest($room_id, $user_id, $block, $purpose, $date, $starting_time, $ending_time);
                if ($roomrequest) {
                    echo json_encode(['status' => 'success', 'message' => 'Request sent successfully']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Error creating room request']);
                }
            }
        } else {
            echo json_encode(['message' => 'Room not found']);
        }
    }
    
    
    // update room request status only (Approved, Rejected)
    public function updateRoomRequestStatus($id, $status) {
        
        // check room request exist
        $roomRequest = $this->roomRequestModel->getRoomRequestById($id);

        if (!$roomRequest) {
            echo json_encode(['message' => 'Room request not found']);
            return;
        }

        // get request schedule data
        $room_id = $roomRequest['room_id'];
        $date = $roomRequest['date'];
        $starting_time = $roomRequest['starting_time'];
        $ending_time = $roomRequest['ending_time'];

        // if approved check for conflicts
        if ($status == 'Approved') {
            $scheduleConflict = $this->roomScheduleModel->roomScheduleExist($room_id, $date, $starting_time, $ending_time);

            // if schedule conflict, reject 
            if ($scheduleConflict) {
                $this->roomRequestModel->updateRoomRequestStatus($id, 'Rejected');
                echo json_encode([
                    'message' => 'The room schedule conflicts with an existing room schedule. The request has been automatically rejected.',
                    'status' => 'error',
                ]);
                return;
            }
        }

        // If rejected or no conflict, update status
        $this->roomRequestModel->updateRoomRequestStatus($id, $status);

        if ($status == 'Approved' || $status == 'Rejected') {
            echo json_encode(['status' => 'success', 'message' => 'Room request updated successfully']);
        }
    }

    // delete room request
    public function deleteRoomRequest($id) {
        $this->roomRequestModel->deleteRoomRequest($id);
    }
}
?>
