<?php

require_once '../models/admin.php';
require_once '../auth/token_helper.php';

class AdminController {

    private $adminModel;

    public function __construct() {
        $this->adminModel = new AdminModel();
    }

// Create admin
public function createAdmin($username, $email, $password) {
    $existingAdmin = $this->adminModel->getAdminByEmail($email);

    // Check if the admin already exists by email
    if ($existingAdmin) {
        echo json_encode(['message' => 'Admin already exists with this email']);
        return;
    }

    // create the admin
    $admin = $this->adminModel->createAdmin($username, $email, $password);
    
    if ($admin) {
        $token = JwtHelper::encode(array(
            'id' => $admin['id'],
            'username' => $admin['username'],
            'role' => 'admin',
            'exp' => time() + 3600
        ));
        echo json_encode([
            'admin' => $admin,
            'message' => 'Admin signed up successfully',
            'token' => $token,
        ]);
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
            $token = JwtHelper::encode(array(
                'id' => $admin['id'],
                'username' => $admin['username'],
                'role' => 'admin',
                'exp' => time() + 3600 
            ));

            echo json_encode([
                'admin' => $admin,
                'message' => 'Login successful!',
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

    // get all admins
    public function getAllAdmin() {
        $admins = $this->adminModel->getAdmins();
        if ($admins) {
            echo json_encode(['admins' => $admins]);
        } else {
            echo json_encode(['message' => 'No admins found']);
        }
    }

    // update admin
    public function updateAdmin($id, $input) {
        if (isset($input['username'], $input['email'], $input['password'])) {
            $result = $this->adminModel->updateAdmin($id, $input['username'], $input['email'], $input['password']);
            echo json_encode(['message' => $result]);
        } else {
            echo json_encode(['message' => 'Missing fields for update']);
        }
    }

    // delete admin
    public function deleteAdmin($id) {
        $result = $this->adminModel->deleteAdmin($id);
        if ($result) {
            echo json_encode(['message' => 'Admin deleted successfully']);
        } else {
            echo json_encode(['message' => 'Error deleting admin']);
        }
    }
}
?>
