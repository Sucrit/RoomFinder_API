<?php

require_once '../models/admin.php';
require_once '../auth/token_helper.php';

    class AdminController {

        private $adminModel;

        public function __construct() {
            $this->adminModel = new AdminModel();
        }

        public function createAdmin($username, $email, $password) {
            $existingAdmin = $this->adminModel->getAdminByEmail($email);

            // check if the admin email already exists
            if ($existingAdmin) {
                echo json_encode(['message' => 'Email already exists']);
                return;
            }
            // create adminn
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

        // update admin details
        public function updateAdmin($id, $input) {
            $admin = $this->adminModel->getAdminById($id);

            if (!$admin) {
                echo json_encode(['message' => 'Admin not found']);
                return;
            }
            $username = isset($input['username']) ? $input['username'] : $admin['username'];
            $email = isset($input['email']) ? $input['email'] : $admin['email'];
            $password = isset($input['password']) ? password_hash($input['password'], PASSWORD_DEFAULT) : $admin['password'];
            $this->adminModel->updateAdmin($id, $username, $email, $password);
            
            echo json_encode(['message' => 'Admin updated successfully']);
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
