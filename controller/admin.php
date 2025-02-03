<?php

require_once '../models/admin.php';
require_once '../config/database.php';

class AdminController {
    private $adminModel;

    public function __construct() {
        $db = new Database();
        $conn = $db->connect();
        $this->adminModel = new AdminModel($conn);
    }

    public function getAdmins() {
        $admins = $this->adminModel->getAdmins();
        echo json_encode($admins ?: ['message' => 'No admins found']);
    }

    public function getAdmin($id) {
        $admin = $this->adminModel->getAdminById($id);
        echo json_encode($admin ?: ['message' => 'Admin not found']);
    }

    public function createAdmin($username, $email, $password) {
        $message = $this->adminModel->createAdmin($username, $email, $password);
        echo json_encode(['message' => $message]);
    }

    public function updateAdmin($id, $input) {
        $admin = $this->adminModel->getAdminById($id);
        if (!$admin) {
            echo json_encode(['message' => 'Admin not found']);
            return;
        }

        $username = $input['username'] ?? $admin['username'];
        $email = $input['email'] ?? $admin['email'];
        $password = isset($input['password']) ? password_hash($input['password'], PASSWORD_DEFAULT) : $admin['password'];

        $message = $this->adminModel->updateAdmin($id, $username, $email, $password);
        echo json_encode(['message' => $message]);
    }
}

?>
