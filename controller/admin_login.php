<?php

require_once '../models/admin.php';

class AdminLoginController {

    private $adminModel;

    public function __construct() {
        $this->adminModel = new AdminModel();
    }
    public function loginAdmin($email, $password) {
        $admin = $this->adminModel->getAdminByEmail($email);
        if (!$admin) {
            echo json_encode(['message' => 'No admin found with this email']);
            return;
        }
        if (password_verify($password, $admin['password'])) {
            echo json_encode(['message' => 'Login successful!', 'admin' => $admin]);
        } else {
            echo json_encode(['message' => 'Invalid email or password']);
        }
    }

    public function getAdmin($id) {
        $admin = $this->adminModel->getAdminById($id);

        if ($admin) {
            echo json_encode(['admin' => $admin]);
        } else {
            echo json_encode(['message' => 'Admin not found']);
        }
    }

    public function updateAdmin($id, $input) {
        if (isset($input['username'], $input['email'], $input['password'])) {
            $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
            $result = $this->adminModel->updateAdmin($id, $input['username'], $input['email'], $hashedPassword);

            echo json_encode(['message' => $result]);
        } else {
            echo json_encode(['message' => 'Missing fields for update']);
        }
    }

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
