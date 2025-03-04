<?php

require_once "../config/database.php";

class RoomRequestModel {
    private $conn;


    public function __construct() {
        $this->conn = Database::getInstance();
    }
    
    public function getRoomRequestsCountByStatus() {
        // count room requests grouped by request status
        $sql = "
            SELECT status, COUNT(*) AS count
            FROM room_request
            GROUP BY status
        ";
        $result = $this->conn->query($sql);

        $statusCounts = [
            'pending' => 0,
            'approved' => 0,
            'rejected' => 0,
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
    
    public function getRecentPendingRequests() {
        $last24Hours = date('Y-m-d H:i:s', strtotime('-24 hours')); // 24hours limit

        $sql = "
            SELECT * FROM room_request
            WHERE status = 'pending' AND created_at >= ?
            ORDER BY created_at DESC
        ";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('s', $last24Hours);
            $stmt->execute();
            $result = $stmt->get_result();
            $recentRequests = [];

            while ($row = $result->fetch_assoc()) {
                $recentRequests[] = $row;
            }
    
            return $recentRequests;
        } else {
            return [];
        }
    }

    // get all pending room request ordered list by latest to oldest
    public function getAllPendingRoomRequests() {
        $sql = "SELECT * FROM room_request WHERE status = 'pending' ORDER BY created_at DESC";
    
        $result = $this->conn->query($sql);
        $pendingRequests = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $pendingRequests[] = $row;
            }
        }
        return $pendingRequests;
    }

    // get all pending room request of a teacher
    public function getRoomRequestsByStudent($userId) {
        $sql = "
            SELECT 
                room_request.id, 
                room_request.room_id, 
                room.room_building,
                room.room_number, 
                room_request.user_id,  
                room_request.block, 
                room_request.purpose, 
                room_request.starting_time, 
                room_request.ending_time, 
                room_request.status
            FROM room_request
            JOIN room ON room_request.room_id = room.id
            WHERE room_request.user_id = ? 
        ";
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
    
    // get a pending room request by id
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

    public function createRoomRequest($room_id, $user_id, $block, $purpose, $date, $starting_time, $ending_time) {
        $sql = "INSERT INTO room_request (room_id, user_id, block, purpose, date, starting_time, ending_time) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('iisssss', $room_id, $user_id, $block, $purpose, $date, $starting_time, $ending_time);
            
            if ($stmt->execute()) {
                return $this->getRoomRequestById($this->conn->insert_id);
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
                return null;
            }
        } else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
            return null;
        }
    }
    
    public function deleteRoomRequest($id) {
        $sql = "DELETE FROM room_request WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Room request deleted successfully']);
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }
}
?>
