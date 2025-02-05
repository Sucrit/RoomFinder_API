<?php

require_once '../models/student.php';
require_once '../auth/token_helper.php';

class StudentLoginController {

    private $studentModel;

    public function __construct() {
        $this->studentModel = new StudentModel();
    }

    public function loginStudent($email, $password) {
        $student = $this->studentModel->getStudentByEmail($email);

        if (!$student) {
            echo json_encode(['message' => 'No student found with this email']);
            return;
        }
        if (password_verify($password, $student['password'])) {
            $token = JwtHelper::encode(array(
                'id' => $student['id'],
                'username' => $student['username'],
                'role' => 'student'
            ));
            echo json_encode(['message' => 'Login successful!', 'token' => $token]);
        } else {
            echo json_encode(['message' => 'Invalid email or password']);
        }
    }  

    public function getStudent($id) {
        $student = $this->studentModel->getStudentById($id);

        if ($student) {
            echo json_encode(['student' => $student]);
        } else {
            echo json_encode(['message' => 'Student not found']);
        }
    }

    public function updateStudent($id, $input) {
        if (isset($input['username'], $input['email'], $input['password'], $input['student_number'])) {
            $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
            $result = $this->studentModel->updateStudent($id, $input['username'], $input['email'], $hashedPassword, $input['student_number']);

            echo json_encode(['message' => $result]);
        } else {
            echo json_encode(['message' => 'Missing fields for update']);
        }
    }

    public function deleteStudent($id) {
        $result = $this->studentModel->deleteStudent($id);

        if ($result) {
            echo json_encode(['message' => 'Student deleted successfully']);
        } else {
            echo json_encode(['message' => 'Error deleting student']);
        }
    }
}

?>
