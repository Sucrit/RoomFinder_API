<?php

require_once '../models/user.php';
require_once '../auth/token_helper.php';

class UserController {

    private $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    // create teacher
    public function createUser($teacher_id, $username, $email, $password, $role) {

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['message' => 'Please enter a valid email address']);
            return;
        }

        $existingUser = $this->userModel->getUserByEmail($email);
        if ($existingUser) {
            echo json_encode(['message' => 'User already exists with this email']);
            return;
        }

        // if (strlen($password) < 8) {
        //     echo json_encode(['message' => 'Password is too short. It must be at least 8 characters long']);
        //     return;
        // }

        $user = $this->userModel->createUser($teacher_id,$username, $email, $password, $role);
        if ($user) {
            echo json_encode(['message' => 'User added successfully']);
        } 
        else {
            echo json_encode(['message' => 'Error signing up user']);
        }
    }
    
    // login user
    public function loginUser($email, $password) {
        $user = $this->userModel->getUserByEmail($email);

        if (!$user) {
            echo json_encode(['message' => 'Email or Password is incorrect']);
            return;
        }

        if (password_verify($password, $user['password'])) {
            $token = JwtHelper::encode(array(
                // create payload data to token
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'exp' => time() + 3600 // 1 hour expiry
            ));
            $this->userModel->storeUserToken($user['id'], $token);
            echo json_encode([
                    'message' => 'Login successful!',
                    'user' => $user,
                    'token' => $token
            ]);
        } 
        else {
            echo json_encode(['message' => 'Email or Password is incorrect']);
        }
    }

    // get user by ID
    public function getUser($id) {
        $user = $this->userModel->getUserById($id);

        if ($user) {
            echo json_encode(['user' => $user]);
        } 
        else {
            echo json_encode(['message' => 'User not found']);
        }
    }

    // get all users
    public function getAllUsers() {
        $users = $this->userModel->getUsers();

        if ($users) {
            echo json_encode(['users' => $users]);
        } 
        else {
            echo json_encode(['message' => 'No users found']);
        }
    }

    // update user details
    public function updateUser($id, $input) {
        $user = $this->userModel->getUserById($id);
    
        if (!$user) {
            echo json_encode(['message' => 'User not found']);
            return;
        }
        $teacher_id = isset($input['teacher_id']) ? $input['teacher_id'] : $user['teacher_id'];
        $username = isset($input['username']) ? $input['username'] : $user['username'];
        $email = isset($input['email']) ? $input['email'] : $user['email'];

        $this->userModel->updateUser($id, $teacher_id, $username, $email);
        echo json_encode(['message' => "Updated Successfully"]);
    }
    
    // change pass
    public function changePassword($userId, $oldPassword, $newPassword, $confirmPassword) {
        $user = $this->userModel->getUserById($userId);
        
        if (!$user) {
            echo json_encode(['message' => 'User not found']);
            return;
        }
        if (!password_verify($oldPassword, $user['password'])) {
            echo json_encode(['message' => 'Old password is incorrect']);
            return;
        }
        if ($newPassword !== $confirmPassword) {
            echo json_encode(['message' => 'New password and confirm password do not match']);
            return;
        }
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $this->userModel->updateUserPassword($userId, $hashedPassword);
    
        echo json_encode(['message' => 'Password changed successfully']);
    }
    
    // delete user
    public function deleteUserById($id) {
        $result = $this->userModel->deleteUser($id);
        
        if ($result) {
            echo json_encode(['message' => 'User deleted successfully']);
        }
        else {
            echo json_encode(['message' => 'Failed to delete user']);
        }
    } 
    
    // logout user
    public function logoutUser($token) {
        try {
            // remove Bearer to string to compare in userjwttokens
            $token = str_replace("Bearer ", "", $token);

            $decodedToken = JwtHelper::decode($token);
    
            if (isset($decodedToken['id'])) {
                $userId = $decodedToken['id'];
                $result = $this->userModel->deleteUserToken($userId, $token);
    
                if ($result === true) {
                    echo json_encode(['message' => 'User logged out successfully']);
                } else {
                    echo json_encode(['message' => $result]); 
                }
            } else {
                echo json_encode(['message' => 'Invalid token or missing ID']);
            }
        } catch (Exception $e) {
            echo json_encode(['message' => 'An error occurred during logout']);
        }
    }  
}
?>
