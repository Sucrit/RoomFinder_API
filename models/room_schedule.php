<?php

require_once "../config/database.php";

class RoomScheduleModel {
    private $conn;


    public function __construct() {
        $this->conn = Database::getInstance();
    }
    
    public function getSchedulesByRoomId($roomId) {
        $sql = "SELECT * FROM room_schedule WHERE room_id = ?";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $roomId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
        } else {
            echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            return [];
        }
    }

    // get room schedule by id
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

    public function createRoomSchedule($room_id, $block, $date, $starting_time, $ending_time) {

        $sql = "INSERT INTO room_schedule (room_id, block, date, starting_time, ending_time) VALUES (?, ?, ?, ?, ?)";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('issss', $room_id, $block, $date, $starting_time, $ending_time);

            if ($stmt->execute()) {
                echo json_encode(['message' => 'Room schedule created successfully']);
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }


    // update room schedule
    public function updateRoomSchedule($id, $room_id, $block, $date, $starting_time, $ending_time) {
        $sql = "UPDATE room_schedule SET room_id = ?, block = ?, date = ?, starting_time = ?, ending_time = ? WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('isssi', $room_id, $block, $date, $starting_time, $ending_time, $id);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Room schedule updated successfully']);
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }

    // delete room schedule
    public function deleteRoomSchedule($id) {
        $sql = "DELETE FROM room_schedule WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id);
            if ($stmt->execute()) {
                echo json_encode(['message' => 'Room schedule deleted successfully']);
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        }
    }
    public function roomExists($room_id) {
        $sql = "SELECT id FROM room WHERE id = ?";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $room_id);
            $stmt->execute();
            $stmt->store_result();
            
            return $stmt->num_rows > 0; // If a row is returned, the room exists
        } else {
            echo json_encode(['message' => 'Error executing query: ' . $this->conn->error]);
            return false;
        }
    }
}
?>