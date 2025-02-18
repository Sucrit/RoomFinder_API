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

    // get all rooms
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

    // get all schedule of a room
public function getRoomSchedules($roomId) {
    $sql = "SELECT * FROM room_schedule WHERE room_id = ?";
    
    if ($stmt = $this->conn->prepare($sql)) {
        $stmt->bind_param('i', $roomId);  
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }
    return [];
}

// create room
public function createRoom($name, $status, $availability, $equipment, $capacity, $roomType) {
    $sql = "INSERT INTO room (name, status, availability, equipment, capacity, room_type) 
            VALUES (?, ?, ?, ?, ?, ?)";

    if ($stmt = $this->conn->prepare($sql)) {
        $stmt->bind_param('ssssis', $name, $status, $availability, $equipment, $capacity, $roomType); 
        if ($stmt->execute()) {
            $roomId = $stmt->insert_id;
            return [
                'id' => $roomId,
                'name' => $name,
                'status' => $status,
                'availability' => $availability,
                'equipment' => $equipment,
                'capacity' => $capacity,
                'room_type' => $roomType
            ];
        } else {
            return 'Error creating room: ' . $this->conn->error;
        }
    }
}


    public function updateRoom($id, $name, $roomType, $capacity, $status, $availability, $equipment) {
        $sql = "UPDATE room 
                SET name = ?, room_type = ?, capacity = ?, status = ?, availability = ?, equipment = ? 
                WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('ssisssi', $name, $roomType, $capacity, $status, $availability, $equipment, $id); 
            if (!$stmt->execute()) {
                return json_encode(['message' => 'Error updating room: ' . $this->conn->error]);
            }
        }
    }

    // update room status if occupied or not
    public function updateRoomStatus($roomId, $status) {
        $query = "UPDATE room SET status = ? WHERE id = ?";
        if ($stmt = $this->conn->prepare($query)) {
            $stmt->bind_param('si', $status, $roomId); // 's' for string, 'i' for integer
            return $stmt->execute();
        } else {
            return false; // Return false if the statement preparation fails
        }
    }
    

    public function deleteRoom($id) {
        $sql = "DELETE FROM room WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id); 
            if (!$stmt->execute()) {
                return json_encode(['message' => 'Error request: ' . $this->conn->error]);
            }
        } 
    }
}

?>