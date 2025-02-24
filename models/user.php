<?php

require_once '../config/database.php'; 

class UserModel {

    private $conn;

    public function __construct() {
        $this->conn = (new Database())->connect();
        if (!$this->conn) {
            die('Database connection failed: ' . mysqli_connect_error());
        }
    }

    // sign up user with role (student or prof)
    public function createUser($username, $email, $password, $role) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, ?)";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssss", $username, $email, $hashedPassword, $role);
            $stmt->execute();
            $insertedId = $stmt->insert_id; 
            $stmt->close();
            $user = $this->getUserById($insertedId);
            return $user;  
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    // login user
    public function getUserByEmail($email) {
        $sql = "SELECT * FROM user WHERE email = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();
            return $user === null ? null : $user;
        } else {
            return "Error: " . $this->conn->error;
        }
    }
    
    // get all users
    public function getUsers() {
        $sql = "SELECT * FROM user";
        $result = $this->conn->query($sql);

        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    // get user by ID
    public function getUserById($id) {
        $sql = "SELECT * FROM user WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();

            return $user === null ? null : $user;
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    // update user details
    public function updateUser($id, $username, $email, $password, $role, $student_number) {
        $sql = "UPDATE user SET username = ?, email = ?, password = ?, role = ?, student_number = ? WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sssssi", $username, $email, $password, $role, $student_number, $id);
            $stmt->execute();
            $stmt->close();
            return "User updated successfully!";
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    // delete user by id
    public function deleteUser($id) {
        $sql = "DELETE FROM user WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            return "User deleted successfully!";
        } else {
            return "Error: " . $this->conn->error;
        }
    }
}
?>
