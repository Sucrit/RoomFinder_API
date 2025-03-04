<?php

require_once '../config/database.php';

class AdminModel {

    private $conn;


    public function __construct() {
        $this->conn = Database::getInstance();
    }

    // store admin token
    public function storeAdminToken($adminId, $token) { 

    $issuedAt = date('Y-m-d H:i:s'); 
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour')); 

    $sql = "INSERT INTO admin_jwt_token (admin_id, token, issued_at, expires_at) VALUES (?, ?, ?, ?)";

    if ($stmt = $this->conn->prepare($sql)) {
        $stmt->bind_param("isss", $adminId, $token, $issuedAt, $expiresAt);
        $stmt->execute();
        $stmt->close();
        return true;
    } else {
        return "Error: " . $this->conn->error;
        }
    }

    // create admin 
    public function createAdmin($username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO admin (username, email, password) VALUES (?, ?, ?)";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss", $username, $email, $hashedPassword);
            $stmt->execute();
            $insertedId = $stmt->insert_id;  
            $stmt->close();
            $admin = $this->getAdminById($insertedId);
            return $admin;
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    // get all admins
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

            return $admin === null ? null : $admin;
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    // get admin by email (login)
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

    // update admin details
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

    // delete an admin
    public function deleteAdmin($id) {
        $sql = "DELETE FROM admin WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    // logout admin
    public function deleteAdminToken($adminId, $token) {
        $sql = "DELETE FROM admin_jwt_token WHERE admin_id = ? AND token = ?";
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("is", $adminId, $token);
            $stmt->execute();
            $stmt->close();
            return true;
        } else {
            return "Error: " . $this->conn->error;
        }
    }
}
?>
