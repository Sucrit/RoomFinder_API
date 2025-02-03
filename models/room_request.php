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

    // get all room requests
    public function getAllRoomRequests() {
        $sql = "SELECT * FROM room_request";
        $result = $this->conn->query($sql);
        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    // get a single room request by ID
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

    // create a new room request
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

    // Update an existing room request
    public function updateRoomRequest($id, $room_id, $student_id, $purpose, $starting_time, $ending_time, $receiver) {
        $sql = "UPDATE room_request SET room_id = ?, student_id = ?, purpose = ?, starting_time = ?, ending_time = ?, receiver = ?
                WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('iissssi', $room_id, $student_id, $purpose, $starting_time, $ending_time, $receiver, $id);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Room request updated successfully']);
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }

    // Delete a room request by ID
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
