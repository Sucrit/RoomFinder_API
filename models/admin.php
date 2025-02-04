<?php

require_once '../config/database.php';

class AdminModel {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // get all admin
    public function getAdmins() {
        $sql = "SELECT * FROM admin";
        $result = $this->conn->query($sql);

        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }
    
    // get admin by id
    public function getAdminById($id) {
        $sql = "SELECT * FROM admin WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $admin = $result->fetch_assoc();
            $stmt->close();

            return $admin;
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    public function createAdmin($username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO admin (username, email, password) VALUES (?, ?, ?)";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss", $username, $email, $hashedPassword);
            $stmt->execute();
            $stmt->close();
            return "Admin created successfully!";
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    public function updateAdmin($id, $username, $email, $password) {
        $sql = "UPDATE admin SET username = ?, email = ?, password = ? WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sssi", $username, $email, $password, $id);
            $stmt->execute();
            $stmt->close();
            return "Admin updated successfully!";
        } else {
            return "Error: " . $this->conn->error;
        }
    }
}
?>
