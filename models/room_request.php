<?php

require_once "../config/database.php";

class RoomRequestModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance();
    }

    // get room request history (approved or rejected only) (order from latest to oldest, descending based on created_at)
    public function getRoomRequestHistory() {
        $sql = "SELECT rr.*, u.username, r.room_building, r.room_number FROM room_request rr JOIN user u ON rr.user_id = u.id
        JOIN room r ON rr.room_id = r.id WHERE rr.status = 'approved' OR rr.status = 'rejected' ORDER BY rr.created_at DESC";

        $result = $this->conn->query($sql);
        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    // get dashboard details
    public function getAllRoomRequests() {
        $sql = "SELECT * FROM room_request";

        $result = $this->conn->query($sql);
        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    // get room requests counts based on status (approved, rejected, pending)
    public function getRoomRequestsCountByStatus() {
        // count room requests grouped by request status
        $sql = "SELECT status, COUNT(*) AS count FROM room_request GROUP BY status";
        $result = $this->conn->query($sql);

        $statusCounts = [
            'Pending' => 0,
            'Approved' => 0,
            'Rejected' => 0,
        ];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                if (array_key_exists($row['status'], $statusCounts)) {
                    $statusCounts[$row['status']] = (int)$row['count']; 
                }
            }
        }
        return $statusCounts;
    }
    
    // get all pending room request ordered by latest to oldest (descending)
    public function getAllPendingRoomRequests() {
        $sql = "SELECT room_request.*, user.username FROM room_request JOIN user ON room_request.user_id = user.id 
        WHERE room_request.status = 'pending' ORDER BY room_request.created_at DESC";

        $result = $this->conn->query($sql);
        $pendingRequests = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $pendingRequests[] = $row;
            }
        }
        return $pendingRequests;
    }

    // get all room request by teacher id
    public function getRoomRequestsByUser($userId) {
        // get room request with room details
        $sql = "SELECT room_request.id, room_request.room_id, room.room_building, room.room_number, room_request.user_id, 
            room_request.block, room_request.purpose, room_request.date, room_request.starting_time,
            room_request.ending_time, room_request.status FROM room_request
            JOIN room ON room_request.room_id = room.id WHERE room_request.user_id = ? ORDER BY room_request.created_at DESC";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $userId); 
            $stmt->execute();
            $result = $stmt->get_result();
    
            return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
        } else {
            echo json_encode(['message' => 'Error executing query: ' . $this->conn->error]);
            return [];
        }
    }
    
    // get room request by id
    public function getRoomRequestById($id) {
        $sql = "SELECT * FROM room_request WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result();

            return $result->num_rows > 0 ? $result->fetch_assoc() : null;
        } else {
            echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            return null;
        }
    }

    // create room request
    public function createRoomRequest($room_id, $user_id, $block, $purpose, $date, $starting_time, $ending_time) {
        $sql = "INSERT INTO room_request (room_id, user_id, block, purpose, date, starting_time, ending_time) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('iisssss', $room_id, $user_id, $block, $purpose, $date, $starting_time, $ending_time);
            
            if ($stmt->execute()) {
                return $this->getRoomRequestById($this->conn->insert_id);
            } 
            else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
                return null;
            }
        } 
        else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
            return null;
        }
    }

    // update room request status (approve or reject a pending room request only)
    public function updateRoomRequestStatus($id, $status) {
        $roomRequest = $this->getRoomRequestById($id);
    
        if ($roomRequest) {
            // check if the room request status is pending
            if ($roomRequest['status'] !== 'Pending') {
                echo json_encode(['message' => 'Only pending room requests can be updated']);
                return;
            }

            $sql = "UPDATE room_request SET status = ? WHERE id = ?";
            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param('si', $status, $id);
                if ($stmt->execute()) {
                    // if the status is approved, add to the room schedule
                    if ($status === 'Approved') {
                        $this->addToRoomSchedule($roomRequest);
                    }
                    elseif ($status === 'Rejected') {
                        echo json_encode(['message' => 'Room request updated successfully']);
                    }
                }  
                else {
                    echo json_encode(['message' => 'Error updating room request status: ' . $this->conn->error]);
                }
            } 
            else {
                echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
            }
        } 
        else {
            echo json_encode(['message' => 'Room request not found']);
        }
    }

    // helper method to add room request to room schedule
    private function addToRoomSchedule($roomRequest) {
        $sql = "INSERT INTO room_schedule (room_id, block, date, starting_time, ending_time) 
                VALUES (?, ?, ?, ?, ?)";
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('issss', 
                $roomRequest['room_id'], 
                $roomRequest['block'], 
                $roomRequest['date'], 
                $roomRequest['starting_time'], 
                $roomRequest['ending_time']
            );
    
            if (!$stmt->execute()) {
                echo json_encode(['message' => 'Error inserting into room schedule: ' . $this->conn->error]);
            } 
            else {
                echo json_encode(['message' => 'Room request updated successfully']);
            }
        } 
        else {
            echo json_encode(['message' => 'Error preparing SQL for room schedule: ' . $this->conn->error]);
        }
    }
    
    // delete room request
    public function deleteRoomRequest($id) {
        $roomRequest = $this->getRoomRequestById($id);

        if (!$roomRequest) {
            echo json_encode(['message' => 'Room request does not exist']);
            return;
        }

        $sql = "DELETE FROM room_request WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Deleted successfully']);
            } 
            else {
                echo json_encode('Error deleting room request');
            }
        } 
        else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }
}
?>
