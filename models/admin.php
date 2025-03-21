<?php

require_once '../config/database.php';

class AdminModel {

    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance();
    }

    // create admin, staff  
    public function createAdmin($username, $email, $password, $role) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO admin (username, email, password, role) VALUES (?, ?, ?, ?)";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssss", $username, $email, $hashedPassword, $role);
            $stmt->execute();
            $insertedId = $stmt->insert_id;  
            $stmt->close();
            $admin = $this->getAdminById($insertedId);
            return $admin;
        } 
        else {
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

    // check if email exist
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
    public function updateAdmin($id, $username, $email) {
        $sql = "UPDATE admin SET username = ?, email = ? WHERE id = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssi", $username, $email, $id);
            $stmt->execute();
            $stmt->close();
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    // change pass
    public function updateAdminPassword($adminId, $newPassword) {
        $sql = "UPDATE admin SET password = ? WHERE id = ?";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("si", $newPassword, $adminId);
            $stmt->execute();
            $stmt->close();
            return true;
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
            return true;
        } 
        else {
            return "Error: " . $this->conn->error;
        }
    }

    // store admin token (login)
    public function storeAdminToken($adminId, $token) { 

        $issuedAt = date('Y-m-d H:i:s'); 
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour')); 
    
        $sql = "INSERT INTO admin_jwt_token (admin_id, token, issued_at, expires_at) VALUES (?, ?, ?, ?)";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("isss", $adminId, $token, $issuedAt, $expiresAt);
            $stmt->execute();
            $stmt->close();
            return true;
        } 
        else {
            return "Error: " . $this->conn->error;
        }
    }

    // delete admin token (logout)
    public function deleteAdminToken($adminId, $token) {
        $sql = "DELETE FROM admin_jwt_token WHERE admin_id = ? AND token = ?";
    
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("is", $adminId, $token);
  
            if ($stmt->execute()) {
                $affectedRows = $stmt->affected_rows;
                $stmt->close();
                if ($affectedRows > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }    
}
?>
