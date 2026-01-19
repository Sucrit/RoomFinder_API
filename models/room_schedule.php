<?php

require_once "../config/database.php";

class RoomScheduleModel {
    private $conn;

    public function __construct() {
<<<<<<< HEAD
        $this->conn = (new Database())->connect();
        if (!$this->conn) {
            die('Database connection failed: ' . mysqli_connect_error());
        }
    }

    // Get a specific room schedule by ID
    public function getRoomScheduleById($id) {
        $sql = "SELECT * FROM room_schedule WHERE id = ?";
=======
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
        $sql = "
        SELECT rs.*, r.room_number, r.room_building FROM room_schedule rs LEFT JOIN room r ON rs.room_id = r.id WHERE rs.id = ?";

>>>>>>> 0fac87130feed1fe796379324ec4f751ffac9e4e
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result();
            return $result->num_rows > 0 ? $result->fetch_assoc() : null;
<<<<<<< HEAD
        } else {
=======
        } 
        else {
>>>>>>> 0fac87130feed1fe796379324ec4f751ffac9e4e
            echo json_encode(['message' => 'Error executing query: ' . $this->conn->error]);
            return null;
        }
    }

<<<<<<< HEAD
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
=======
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
        $sql = "UPDATE room_schedule SET block = ?, date = ?, starting_time = ?, ending_time = ? WHERE id = ?";  

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('ssssi', $block, $date, $starting_time, $ending_time, $id);
            if (!$stmt->execute()) {
>>>>>>> 0fac87130feed1fe796379324ec4f751ffac9e4e
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Error preparing SQL: ' . $this->conn->error]);
        }
    }

<<<<<<< HEAD
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
=======
    // delete room schedule
>>>>>>> 0fac87130feed1fe796379324ec4f751ffac9e4e
    public function deleteRoomSchedule($id) {
        $sql = "DELETE FROM room_schedule WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param('i', $id);
            if ($stmt->execute()) {
<<<<<<< HEAD
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
=======
                if ($stmt->affected_rows > 0) {
                    echo json_encode(['status' => 'success', 'message' => 'Room schedule deleted successfully']);
                } else {
                    echo json_encode(['status' => 'success', 'message' => 'Room schedule does not exist']);
                }
            } else {
                echo json_encode(['message' => 'Error: ' . $this->conn->error]);
            }
        }
    }
    
    // check if room schedule exists (avoid time conflict)
    public function roomScheduleExist($room_id, $date, $starting_time, $ending_time, $exclude_id = null) {
        $sql = "SELECT * FROM room_schedule WHERE room_id = ? AND date = ? AND ";
    
        // exclude sched id that is being updated to the checking
        if ($exclude_id) {
            $sql .= "id != ? AND "; 
        }
    
        // time conflicts 
        $sql .= "( 
            (starting_time < ? AND ending_time > ?)  -- creating schedule that eats an existing schedule
            OR 
            (starting_time < ? AND ending_time > ?)  -- creating a starting time that is inside an existing schedule
            OR 
            (? BETWEEN starting_time AND ending_time) -- creating schedule inside a schedule
            OR 
            (? BETWEEN starting_time AND ending_time)  -- creating an ending time inside an existing schedule
            OR 
            (starting_time BETWEEN ? AND ?)  -- Existing schedule starts within the new schedule's range
            OR 
            (ending_time BETWEEN ? AND ?)  -- Existing schedule ends within the new schedule's range
        )";
    
        if ($stmt = $this->conn->prepare($sql)) {
            // update schedule
            if ($exclude_id) {
                $stmt->bind_param('issssssssssss', $room_id,
                $date, $exclude_id, $starting_time, $ending_time,
                $starting_time, $ending_time, $starting_time, $ending_time,
                $starting_time, $ending_time, $starting_time, $ending_time);
            } 
            // create schedule
            else {
                $stmt->bind_param('isssssssssss', $room_id,
                $date, $starting_time, $ending_time, $starting_time,
                $ending_time, $starting_time, $ending_time, $starting_time,
                $ending_time, $starting_time, $ending_time);
            }
    
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
>>>>>>> 0fac87130feed1fe796379324ec4f751ffac9e4e
