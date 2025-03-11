<?php

require_once '../models/admin.php';
require_once '../models/user.php';
require_once '../auth/token_helper.php';

class AdminController {

    private $adminModel;
    private $userModel;

    public function __construct() {
        $this->adminModel = new AdminModel();
        $this->userModel = new UserModel();
    }

    public function createAdmin($username, $email, $password, $role) {
        $existingAdmin = $this->adminModel->getAdminByEmail($email);
        if ($existingAdmin) {
            echo json_encode(['message' => 'Email already exists']);
            return;
        }
        $admin = $this->adminModel->createAdmin($username, $email, $password, $role);
        if ($admin) {
            echo json_encode( $admin);
        } else {
            echo json_encode(['message' => 'Error signing up admin']);
        }
    }
    
    // admin login
    public function loginAdmin($email, $password) {
        $admin = $this->adminModel->getAdminByEmail($email);

        if (!$admin) {
            echo json_encode(['message' => 'No admin found with this email']);
            return;
        }

        if (password_verify($password, $admin['password'])) {
            // generate token
            $token = JwtHelper::encode(array(
                'id' => $admin['id'],
                'username' => $admin['username'],
                'role' => 'admin',
                'exp' => time() + 3600 // 1 hour
            ));
            $this->adminModel->storeAdminToken($admin['id'], $token);
            echo json_encode([
                'id' => $admin['id'],
                'message' => 'Login successful!',
                'username' => $admin['username'],
                'email' => $admin['email'],
                'token' => $token
            ]); 
        } else {
            echo json_encode(['message' => 'Invalid email or password']);
        }
    }
    
    // get admin by id
    public function getAdmin($id) {
        $admin = $this->adminModel->getAdminById($id);
        if ($admin) {
            echo json_encode(['admin' => $admin]);
        } else {
            echo json_encode(['message' => 'Admin not found']);
        }
    }

    // get all users and admins 
    public function getAllUsersAndAdmin() {
        $admins = $this->adminModel->getAdmins();
        $users = $this->userModel->getUsers();
    
        // array merge admins and users 
        $allUsersAndAdmins = array_merge($admins, $users);

        if (!empty($allUsersAndAdmins)) {
            echo json_encode($allUsersAndAdmins);
        } else {
            echo json_encode(['message' => 'No users or admins found']);
        }
    }
    
    // update admin details
    public function updateAdmin($id, $input) {
        $admin = $this->adminModel->getAdminById($id);

        if (!$admin) {
            echo json_encode(['message' => 'Admin not found']);
            return;
        }
        $username = isset($input['username']) ? $input['username'] : $admin['username'];
        $email = isset($input['email']) ? $input['email'] : $admin['email'];
        $this->adminModel->updateAdmin($id, $username, $email);
        echo json_encode(['message' => 'Admin updated successfully']);
    }

    // change pass
    public function changePassword($adminId, $oldPassword, $newPassword, $confirmPassword) {
        $admin = $this->adminModel->getAdminById($adminId);
        
        if (!$admin) {
            echo json_encode(['message' => 'User not found']);
            return;
        }
        if (!password_verify($oldPassword, $admin['password'])) {
            echo json_encode(['message' => 'Old password is incorrect']);
            return;
        }
        if ($newPassword !== $confirmPassword) {
            echo json_encode(['message' => 'New password and confirm password do not match']);
            return;
        }
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $this->adminModel->updateAdminPassword($adminId, $hashedPassword);
    
        echo json_encode(['message' => 'Password changed successfully']);
    }

    // delete admin
    public function deleteAdminById($id) {
        $result = $this->adminModel->deleteAdmin($id);

        if (!$result) {
            echo json_encode(['message' => 'Admin does not exist']);
        } else {
            echo json_encode(['message' => 'Admin deleted successfully']);
        }
    }

    // delete token in token table when logging out
    public function logoutAdmin($token) {
        $decodedToken = JwtHelper::decode($token);

        if (isset($decodedToken['id'])) {
            $adminId = $decodedToken['id']; 
            $this->adminModel->deleteAdminToken($adminId, $token); 
            echo json_encode(['message' => 'Admin logged out successfully']);
        } else {
            echo json_encode(['message' => 'Invalid token or missing ID']);
        }
    }
}
?>
