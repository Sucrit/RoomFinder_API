<?php

require_once '../config/database.php'; 

class UserModel {

    private $conn;

 
    public function __construct() {
        $this->conn = Database::getInstance();
    }

    // create user with a role teacher only
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

    // login user (check if email exist)
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

    // update user
    public function updateUser($id, $teacher_id, $username, $email) {
        $sql = "UPDATE user SET teacher_id = ?, username = ?, email = ? WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sssi", $teacher_id, $username, $email, $id);
            $stmt->execute();
            $stmt->close();
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    // change pass
    public function updateUserPassword($userId, $newPassword) {
        $sql = "UPDATE user SET password = ? WHERE id = ?";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("si", $newPassword, $userId);
            $stmt->execute();
            $stmt->close();
            return true;
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

    // store user token
    public function storeUserToken($userId, $token) {

        $issuedAt = date('Y-m-d H:i:s');  
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour')); 
    
        $sql = "INSERT INTO user_jwt_token (user_id, token, issued_at, expires_at) VALUES (?, ?, ?, ?)";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("isss", $userId, $token, $issuedAt, $expiresAt);
            $stmt->execute();
            $stmt->close();
            return true;
        } else {
            return "Error: " . $this->conn->error;
        }
    }
    
}
?>
