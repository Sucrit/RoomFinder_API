<?php

require_once '../config/database.php'; 

class StudentModel {

    private $conn;

    public function __construct() {
        $this->conn = (new Database())->connect();
        if (!$this->conn) {
            die('Database connection failed: ' . mysqli_connect_error());
        }
    }

    public function createStudent($username, $email, $password, $student_number) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO student (username, email, password, student_number) VALUES (?, ?, ?, ?)";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssss", $username, $email, $hashedPassword, $student_number);
            $stmt->execute();
            $insertedId = $stmt->insert_id; 
            $stmt->close();
            $student = $this->getStudentById($insertedId);
            return $student;  
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    // get all students
    public function getStudents() {
        $sql = "SELECT * FROM student";
        $result = $this->conn->query($sql);

        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    // get student by ID
    public function getStudentById($id) {
        $sql = "SELECT * FROM student WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $student = $result->fetch_assoc();
            $stmt->close();

            return $student === null ? null : $student;
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    public function updateStudent($id, $username, $email, $password, $student_number) {
        $sql = "UPDATE student SET username = ?, email = ?, password = ?, student_number = ? WHERE id = ?";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssssi", $username, $email, $password, $student_number, $id);
            $stmt->execute();
            $stmt->close();
            return "Student updated successfully!";
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    public function deleteStudent($id) {
        $sql = "DELETE FROM student WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            return "Student deleted successfully!";
        } else {
            return "Error: " . $this->conn->error;
        }
    }
// login student based on email
public function getStudentByEmail($email) {
    $sql = "SELECT * FROM student WHERE email = ?";

    if ($stmt = $this->conn->prepare($sql)) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $student = $result->fetch_assoc();
        $stmt->close();
        return $student === null ? null : $student;
    } else {
        return "Error: " . $this->conn->error;
    }
}


}
?>
