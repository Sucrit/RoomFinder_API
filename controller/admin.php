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

    // create administrator, staff, teacher
    public function createAdmin($username, $email, $password, $role) {
        
        // filtrer valid email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['message' => 'Please enter a valid email address']);
            return;
        }

        $existingAdmin = $this->adminModel->getAdminByEmail($email);
        if ($existingAdmin) {
            echo json_encode(['message' => 'Email already exists']);
            return;
        }

        // if (strlen($password) < 8) {
        //     echo json_encode(['message' => 'Password is too short. It must be at least 8 characters long']);
        //     return;
        // }

        $admin = $this->adminModel->createAdmin($username, $email, $password, $role);
        if ($admin) {
            echo json_encode( [
                'message' => 'User added successfully'
            ]);
        } 
        else {
            echo json_encode(['message' => 'Error signing up admin']);
        }
    }
    
    // admin login
    public function loginAdmin($email, $password) {
        $admin = $this->adminModel->getAdminByEmail($email);

        if (!$admin) {
            echo json_encode(['message' => 'Invalid Email or Password']);
            return;
        }

        if (password_verify($password, $admin['password'])) {
            // generate token
            $token = JwtHelper::encode(array(
                'id' => $admin['id'],
                'username' => $admin['username'],
                'role' => $admin['role'],
                'exp' => time() + 3600 // 1 hour
            ));
            $this->adminModel->storeAdminToken($admin['id'], $token);
            echo json_encode([
                'message' => 'Login successful!',
                'admin' => $admin,
                'token' => $token
                
            ]); 
        } 
        else {
            echo json_encode(['message' => 'Invalid email or password']);
        }
    }
    
    // get admin by id
    public function getAdmin($id) {
        $admin = $this->adminModel->getAdminById($id);
        if ($admin) {
            echo json_encode(['admin' => $admin]);
        } 
        else {
            echo json_encode(['message' => 'Admin not found']);
        }
    }

    // get all users and admins 
    public function getAllUsersAndAdmin() {
        $admins = $this->adminModel->getAdmins();
        $users = $this->userModel->getUsers();
    
        // array merge admins and users 
        $allUsers = array_merge($admins, $users);

        if (!empty($allUsers)) {
            echo json_encode(['All Users' => $allUsers]);
        } 
        else {
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
        
        // check if admin exist
        if (!$admin) {
            echo json_encode(['message' => 'User not found']);
            return;
        }

        // check if old pass value does not match the account pass
        if (!password_verify($oldPassword, $admin['password'])) {
            echo json_encode(['message' => 'Old password is incorrect']);
            return;
        }

        // check new pass same as old
        if ($oldPassword === $newPassword) {
            echo json_encode(['message' => 'Your new password cannot be the same as the old password']);
            return;
        }

        // check if new pass and confirm pass matched
        if ($newPassword !== $confirmPassword) {
            echo json_encode(['message' => 'New password and confirm password do not match']);
            return;
        }

        // change pass
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $this->adminModel->updateAdminPassword($adminId, $hashedPassword);
    
        echo json_encode(['message' => 'Password changed successfully']);
    }

    // delete admin by id
    public function deleteAdminById($id) {
        $result = $this->adminModel->deleteAdmin($id);

        if (!$result) {
            echo json_encode(['message' => 'Admin does not exist']);
        } else {
            echo json_encode(['message' => 'Admin deleted successfully']);
        }
    }

    // logout admin or staff
    public function logoutAdmin($token) {
        try {
            // remove 'Bearer ' from the token string to compare in adminjwtoken
            $token = str_replace("Bearer ", "", $token);

             // Log the token to confirm it's being received correctly
        error_log('Received token: ' . $token);

            $decodedToken = JwtHelper::decode($token);

             // Log the decoded token to confirm it's being decoded properly
        error_log('Decoded token: ' . print_r($decodedToken, true));
            
            // check token user id
            if (isset($decodedToken['id'])) {
                $adminId = $decodedToken['id'];

                $result = $this->adminModel->deleteAdminToken($adminId, $token);

                 // Log the result of deleting the token
            error_log('Delete result: ' . $result);
    
                if ($result === true) {
                    echo json_encode(['message' => 'User logged out successfully']);
                } else if ($result === false) {
                    echo json_encode(['message' => 'Token does not exist']);
                }
            } else {
                echo json_encode(['message' => 'Invalid token or missing ID']);
            }
        } catch (Exception $e) {
            echo json_encode(['message' => 'An error occurred during admin logout']);
        }
    }
}
?>
