<?php

require_once "../config/database.php";

class RoomScheduleModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance();
    }

    // get all room schedule
    public function getAllRoomSchedule() {
        $sql = "SELECT rs.*, r.room_number, room_building FROM room_schedule rs JOIN room r ON rs.room_id = r.id";
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->execute();
            $result = $stmt->get_result();

            return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
        } 
        else {
            echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            return [];
        }
    }

    // get all ongoing schedules
    public function getAllOngoingSchedules() {
    date('Y-m-d H:i:s');

    $sql = "SELECT rs.*, r.room_building, r.room_number FROM room_schedule rs JOIN room r ON rs.room_id = r.id WHERE rs.date = CURDATE() AND rs.starting_time <= CURTIME() AND rs.ending_time > CURTIME()";

    if ($stmt = $this->conn->prepare($sql)) {
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    } 
    else {
        echo json_encode(['message' => 'Error: ' . $this->conn->error]);
        return [];
        }
    }

    // get room schedule by room id
    public function getSchedulesByRoomId($roomId) {
        $sql = "SELECT * FROM room_schedule WHERE room_id = ?";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $roomId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
        } 
        else {
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
        } 
        else {
            echo json_encode(['message' => 'Error executing query: ' . $this->conn->error]);
            return null;
        }
    }

    // create room schedule of a room
    public function createRoomSchedule($room_id, $block, $date, $starting_time, $ending_time) {
        $sql = "INSERT INTO room_schedule (room_id, block, date, starting_time, ending_time) VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('issss', $room_id, $block, $date, $starting_time, $ending_time);
        
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            return true;
        } 
        else {
            return false;
        }
    }

    // update room schedule
    public function updateRoomSchedule($id, $room_id, $block, $date, $starting_time, $ending_time) {
        $sql = "UPDATE room_schedule SET room_id = ?, block = ?, date = ?, starting_time = ?, ending_time = ? WHERE id = ?";  

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('issssi', $room_id, $block, $date, $starting_time, $ending_time, $id);
            if (!$stmt->execute()) {
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
                if ($stmt->affected_rows > 0) {
                    echo json_encode(['message' => 'Room schedule deleted successfully']);
                } else {
                    echo json_encode(['message' => 'Room schedule does not exist']);
                }
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        }
    }
    
    // check if room schedule exists (avoid time conflict)
    public function roomScheduleExist($room_id, $date, $starting_time, $ending_time) {
        // check if starting time is greater than ending time (time conflict)
        if ($starting_time >= $ending_time) {
            echo json_encode(['message' => 'Starting time must be before ending time']);
            return true;
        }
            
        $sql = "SELECT * FROM room_schedule WHERE room_id = ? AND date = ? AND ((starting_time < ? AND ending_time > ?) 
                OR (starting_time < ? AND ending_time > ?) OR (? BETWEEN starting_time AND ending_time) OR (? BETWEEN starting_time AND ending_time))"; 

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('isssssss', $room_id, $date, $starting_time, $ending_time, $starting_time, $ending_time, $starting_time, $ending_time);
            $stmt->execute();
            $result = $stmt->get_result();
            
            return $result->num_rows > 0;
        } else {
            echo json_encode(['message' => 'Error checking schedule: ' . $this->conn->error]);
            return false;
        }
    }
}
?>