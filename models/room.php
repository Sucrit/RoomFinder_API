<?php

require_once "../config/database.php";

class RoomModel {
    private $conn;

    public function __construct() {
        $this->conn = (new Database())->connect();
        if (!$this->conn) {
            die('Database connection failed: ' . mysqli_connect_error());
        }
    }
    // Get all rooms
    public function getAllRoom() {
        $sql = "SELECT * FROM room";
        $result = $this->conn->query($sql);

        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    // Get room by ID
    public function getRoomById($id) {
        $sql = "SELECT * FROM room WHERE id = ?";

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

    // Create a room
    public function createRoom($roomName, $roomType, $capacity) {
        $sql = "INSERT INTO room (room_name, room_type, capacity) VALUES (?, ?, ?)";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('ssi', $roomName, $roomType, $capacity); // 'ssi' means string, string, integer
            if ($stmt->execute()) {
                return json_encode(['message' => 'Room created successfully']);
            } else {
                return json_encode(['message' => 'Error creating room: ' . $this->conn->error]);
            }
        } else {
            return json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }

    // Update room 
    public function updateRoom($id, $roomName, $roomType, $capacity) {
        $sql = "UPDATE room SET room_name = ?, room_type = ?, capacity = ? WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('ssii', $roomName, $roomType, $capacity, $id); // 'ssii' means string, string, integer, integer
            if ($stmt->execute()) {
                return json_encode(['message' => 'Room updated successfully']);
            } else {
                return json_encode(['message' => 'Error updating room: ' . $this->conn->error]);
            }
        } else {
            return json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }

    // Delete a room
    public function deleteRoom($id) {
        $sql = "DELETE FROM room WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id); 
            if ($stmt->execute()) {
                return json_encode(['message' => 'Room deleted successfully']);
            } else {
                return json_encode(['message' => 'Error deleting room: ' . $this->conn->error]);
            }
        } else {
            return json_encode(['message' => 'Error: ' . $this->conn->error]);
        }
    }
}
   

?>