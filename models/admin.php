<?php

require_once '../config/database.php';

class AdminModel {

    private $conn;

    public function __construct() {
        $this->conn = (new Database())->connect();
        if (!$this->conn) {
            die('Database connection failed: ' . mysqli_connect_error());
        }
    }

    // sign up admin
    public function createAdmin($username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO admin (username, email, password) VALUES (?, ?, ?)";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss", $username, $email, $hashedPassword);
            $stmt->execute();
            $insertedId = $stmt->insert_id;  // Get the inserted admin's ID
            $stmt->close();
            $admin = $this->getAdminById($insertedId);
            return $admin;
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    public function getAdmins() {
        $sql = "SELECT * FROM admin";
        $result = $this->conn->query($sql);

        return $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function getAdminById($id) {
        $sql = "SELECT * FROM admin WHERE id = ?";
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $admin = $result->fetch_assoc();
            $stmt->close();

            return $admin === null ? null : $admin;
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

    public function deleteAdmin($id) {
        $sql = "DELETE FROM admin WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            return "Admin deleted successfully!";
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    // login admin
    public function getAdminByEmail($email) {
        $sql = "SELECT * FROM admin WHERE email = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            $admin = $result->fetch_assoc();
            $stmt->close();
            return $admin === null ? null : $admin;
        } else {
            return "Error: " . $this->conn->error;
        }
    }
}
?>
