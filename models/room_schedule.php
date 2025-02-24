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

    public function createRoomSchedule($room_id, $block, $starting_time, $ending_time) {
        // check for backward scheduling 
        if (strtotime($starting_time) >= strtotime($ending_time)) {
            echo json_encode(['Conflict' => 'Starting time cannot be later than ending time.']);
            return;
        }
    
        // time range pverlapping conflict calculation
        $sql = "SELECT * FROM room_schedule 
                WHERE room_id = ? 
                AND (
                    (starting_time < ? AND ending_time > ?)    -- New schedule starts during an existing one
                    OR
                    (starting_time < ? AND ending_time > ?)    -- New schedule ends during an existing one
                    OR
                    (starting_time >= ? AND starting_time < ?) -- New schedule starts while another is ongoing
                    OR
                    (ending_time > ? AND ending_time <= ?)     -- New schedule ends while another is ongoing
                )";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('issssssss', $room_id, $starting_time, $starting_time, $ending_time, $ending_time, $starting_time, $ending_time, $starting_time, $ending_time);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                echo json_encode(['Conflict' => 'A schedule already exists in this time slot for this room.']);
                return;
            } else {
                // No conflict, proceed with inserting the schedule
                $insertSql = "INSERT INTO room_schedule (room_id, block, starting_time, ending_time) VALUES (?, ?, ?, ?)";
                if ($insertStmt = $this->conn->prepare($insertSql)) {
                    $insertStmt->bind_param('isss', $room_id, $block, $starting_time, $ending_time);
                    if ($insertStmt->execute()) {
                        echo json_encode(['message' => 'Room schedule created successfully']);
                    } else {
                        echo json_encode(['message' => 'Error: ' . $this->conn->error]);
                    }
                } else {
                    echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
                }
            }
        }
    }    

    // update room schedule
    public function updateRoomSchedule($id, $room_id, $block, $starting_time, $ending_time) {
        $sql = "UPDATE room_schedule SET room_id = ?, block = ?, starting_time = ?, ending_time = ? WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('isssi', $room_id, $block, $starting_time, $ending_time, $id);
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
}
?>