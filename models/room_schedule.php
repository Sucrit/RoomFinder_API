<?php

require_once "../config/database.php";

class RoomScheduleModel {
    private $conn;

    public function __construct() {
        $this->conn = (new Database())->connect();
        if (!$this->conn) {
            die('Database connection failed: ' . mysqli_connect_error());
        }
    }

    // Get a specific room schedule by ID
    public function getRoomScheduleById($id) {
        $sql = "SELECT * FROM room_schedule WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result();
            return $result->num_rows > 0 ? $result->fetch_assoc() : null;
        } else {
            echo json_encode(['message' => 'Error executing query: ' . $this->conn->error]);
            return null;
        }
    }

    // Get all room schedules
    public function getAllRoomSchedules() {
        $sql = "SELECT * FROM room_schedule";
        $result = $this->conn->query($sql);
        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    // Create a new room schedule
    public function createRoomSchedule($room_id, $starting_time, $ending_time) {
        $sql = "INSERT INTO room_schedule (room_id, starting_time, ending_time) VALUES (?, ?, ?)";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('iss', $room_id, $starting_time, $ending_time);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Room schedule created successfully']);
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }

    // Update a room schedule
    public function updateRoomSchedule($id, $room_id, $starting_time, $ending_time) {
        $sql = "UPDATE room_schedule SET room_id = ?, starting_time = ?, ending_time = ? WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('issi', $room_id, $starting_time, $ending_time, $id);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Room schedule updated successfully']);
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }

    // Delete a room schedule
    public function deleteRoomSchedule($id) {
        $sql = "DELETE FROM room_schedule WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Room schedule deleted successfully']);
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }
}
?>
