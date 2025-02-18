<?php

require_once "../config/database.php";

class RoomRequestModel {
    private $conn;

    public function __construct() {
        $this->conn = (new Database())->connect();
        if (!$this->conn) {
            die('Database connection failed: ' . mysqli_connect_error());
        }
    }

    public function getRoomRequestsByStudent($studentId) {
        // SQL query to get room requests for the specific student, including the room name
        $sql = "
            SELECT 
                room_request.id, room_request.room_id, room.name AS room_name, room_request.student_id, room_request.block, room_request.purpose, room_request.starting_time, 
                room_request.ending_time, room_request.receiver, room_request.status
            FROM room_request
            JOIN room ON room_request.room_id = room.id
            WHERE room_request.student_id = ?
        ";
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $studentId);  // Bind student ID
            $stmt->execute();
            $result = $stmt->get_result();
        
            // If room requests exist for this student, return them
            if ($result->num_rows > 0) {
                return $result->fetch_all(MYSQLI_ASSOC);
            } else {
                return null;  // No room requests found for this student
            }
        } else {
            echo json_encode(['message' => 'Error executing query: ' . $this->conn->error]);
            return null;
        }
    }
       

    // get all pending room requests
    public function getAllRoomRequests() {
        $sql = "SELECT * FROM room_request";
        $result = $this->conn->query($sql);
        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
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

    public function createRoomRequest($room_id, $student_id, $purpose, $starting_time, $ending_time, $receiver) {
        $sql = "INSERT INTO room_request (room_id, student_id, purpose, starting_time, ending_time, receiver) 
                VALUES (?, ?, ?, ?, ?, ?)";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('iissss', $room_id, $student_id, $purpose, $starting_time, $ending_time, $receiver);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Room request created successfully']);
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
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
