<?php

require_once '../models/admin.php';

class AdminSignupController {

    private $adminModel;

    public function __construct() {
        $this->adminModel = new AdminModel();
    }
    public function createAdmin($username, $email, $password) {
        $existingAdmin = $this->adminModel->getAdminByEmail($email);
        if ($existingAdmin) {
            echo json_encode(['message' => 'Admin already exists with this email']);
            return;
        }

        $admin = $this->adminModel->createAdmin($username, $email, $password);
        if ($admin) {
            echo json_encode(['message' => 'Admin signed up successfully', 'admin' => $admin]);
        } else {
            echo json_encode(['message' => 'Error signing up admin']);
        }
    }
}
?>
