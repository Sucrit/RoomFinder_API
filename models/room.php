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

public function createRoom($name, $status, $availability, $equipment, $capacity, $roomType) {
    $sql = "INSERT INTO room (name, status, availability, equipment, capacity, room_type) 
            VALUES (?, ?, ?, ?, ?, ?)";

    if ($stmt = $this->conn->prepare($sql)) {
        $stmt->bind_param('ssssis', $name, $status, $availability, $equipment, $capacity, $roomType); // 'ssssis' means: string, string, string, string, integer, string
        
        if ($stmt->execute()) {
            return json_encode(['message' => 'Room created successfully']);
        } else {
            return json_encode(['message' => 'Error creating room: ' . $this->conn->error]);
        }
    } else {
        return json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
    }
}

    public function updateRoom($id, $name, $roomType, $capacity, $status, $availability, $equipment) {
        $sql = "UPDATE room 
                SET name = ?, room_type = ?, capacity = ?, status = ?, availability = ?, equipment = ? 
                WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('ssisssi', $name, $roomType, $capacity, $status, $availability, $equipment, $id); 

            if ($stmt->execute()) {
                return json_encode(['message' => 'Room updated successfully']);
            } else {
                return json_encode(['message' => 'Error updating room: ' . $this->conn->error]);
            }
        } else {
            return json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }

    public function deleteRoom($id) {
        $sql = "DELETE FROM room WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id); 
            if ($stmt->execute()) {
                return json_encode(['message' => 'Room deleted successfully']);
            } else {
                return json_encode(['message' => 'Error deleting room: ' . $this->conn->error]);
            }
        } 
    }
}
   

?>