<?php

require_once '../models/user.php';
require_once '../auth/token_helper.php';

class UserController {

    private $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    // create user
public function createUser($username, $email, $password, $role) {
    // Check if user with the same email already exists
    $existingUser = $this->userModel->getUserByEmail($email);
    if ($existingUser) {
        echo json_encode(['message' => 'User already exists with this email']);
        return;
    }

    // Ensure role is either 'student' or 'prof' (or other roles as needed)
    if (!in_array($role, ['student', 'prof'])) {
        echo json_encode(['message' => 'Invalid role specified']);
        return;
    }

    // Create the user
    $user = $this->userModel->createUser($username, $email, $password, $role);  
    if ($user) {
        // Encode JWT token with user details including role
        $token = JwtHelper::encode(array(
            'id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'exp' => time() + 3600 // 1 hour expiry
        ));

        // Return success response with user and token
        echo json_encode([
            'user' => $user,
            'message' => 'User signed up successfully',
            'token' => $token
        ]);
    } else {
        echo json_encode(['message' => 'Error signing up user']);
    }
}
 
    // login user
    public function loginUser($email, $password) {
        $user = $this->userModel->getUserByEmail($email);

        if (!$user) {
            echo json_encode(['message' => 'No user found with this email']);
            return;
        }
        if (password_verify($password, $user['password'])) {
            $token = JwtHelper::encode(array(
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ));
            echo json_encode([
                'user' => $user,
                'message' => 'Login successful!',
                'token' => $token]);
        } else {
            echo json_encode(['message' => 'Invalid email or password']);
        }
    }  

    // get user by ID
    public function getUser($id) {
        $user = $this->userModel->getUserById($id);

        if ($user) {
            echo json_encode(['user' => $user]);
        } else {
            echo json_encode(['message' => 'User not found']);
        }
    }

    // get all users
    public function getAllUsers() {
        $users = $this->userModel->getUsers();

        if ($users) {
            echo json_encode(['users' => $users]);
        } else {
            echo json_encode(['message' => 'No users found']);
        }
    }

    // update user details
    public function updateUser($id, $input) {
        // Get current user details from the database
        $user = $this->userModel->getUserById($id);
    
        if (!$user) {
            echo json_encode(['message' => 'User not found']);
            return;
        }
    
        // Check if new input values exist, otherwise use the current values
        $username = isset($input['username']) ? $input['username'] : $user['username'];
        $email = isset($input['email']) ? $input['email'] : $user['email'];
        $password = isset($input['password']) ? password_hash($input['password'], PASSWORD_DEFAULT) : $user['password'];
        $role = isset($input['role']) ? $input['role'] : $user['role'];
        $student_number = isset($input['student_number']) ? $input['student_number'] : $user['student_number']; // added student_number handling
    
        // Update user details in the database
        $this->userModel->updateUser($id, $username, $email, $password, $role, $student_number);
        echo json_encode(['message' => 'User updated successfully']);
    }
    
    // delete user
    public function deleteUser($id) {
        $result = $this->userModel->deleteUser($id);

        if ($result) {
            echo json_encode(['message' => 'User deleted successfully']);
        } else {
            echo json_encode(['message' => 'Error deleting user']);
        }
    }
}
?>
