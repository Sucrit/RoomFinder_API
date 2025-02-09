<?php

require_once '../config/database.php';

class TeacherModel {

    private $conn;

    public function __construct() {
        $this->conn = (new Database())->connect();
        if (!$this->conn) {
            die('Database connection failed: ' . mysqli_connect_error());
        }
    }

    // Create a new teacher
    public function createTeacher($username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);  
        $sql = "INSERT INTO teacher (username, email, password) VALUES (?, ?, ?)";  

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss", $username, $email, $hashedPassword);
            $stmt->execute();
            $insertedId = $stmt->insert_id;  
            $stmt->close();
            $teacher = $this->getTeacherById($insertedId);
            return $teacher;
        } else {
            return "Error: " . $this->conn->error; 
        }
    }

    // get all teachers
    public function getTeachers() {
        $sql = "SELECT * FROM teacher";  
        $result = $this->conn->query($sql);

        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];  
    }

    // get teacher by ID
    public function getTeacherById($id) {
        $sql = "SELECT * FROM teacher WHERE id = ?";  
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $teacher = $result->fetch_assoc();
            $stmt->close();

            return $teacher === null ? null : $teacher;
        } else {
            return "Error: " . $this->conn->error;  
        }
    }

    // get teacher by email
    public function getTeacherByEmail($email) {
        $sql = "SELECT * FROM teacher WHERE email = ?";  
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            $teacher = $result->fetch_assoc();
            $stmt->close();
            return $teacher === null ? null : $teacher;
        } else {
            return "Error: " . $this->conn->error;  
        }
    }

    // update teacher information
    public function updateTeacher($id, $username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);  
        $sql = "UPDATE teacher SET username = ?, email = ?, password = ? WHERE id = ?";  

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sssi", $username, $email, $hashedPassword, $id);
            $stmt->execute();
            $stmt->close();
            return "Teacher updated successfully!"; 
        } else {
            return "Error: " . $this->conn->error;  
        }
    }

    // delete a teacher
    public function deleteTeacher($id) {
        $sql = "DELETE FROM teacher WHERE id = ?"; 

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            return "Teacher deleted successfully!"; 
        } else {
            return "Error: " . $this->conn->error;  
        }
    }
}
?>
