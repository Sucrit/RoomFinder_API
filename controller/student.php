<?php

require_once '../models/student.php';
require_once '../auth/token_helper.php';

class StudentController {

    private $studentModel;

    public function __construct() {
        $this->studentModel = new StudentModel();
    }

 // create student
public function createStudent($username, $email, $password, $student_number) {
    $existingStudent = $this->studentModel->getStudentByEmail($email);
    if ($existingStudent) {
        echo json_encode(['message' => 'Student already exists with this email']);
        return;
    }
    $student = $this->studentModel->createStudent($username, $email, $password, $student_number);  
    if ($student) {
        $token = JwtHelper::encode(array(
            'id' => $student['id'],
            'username' => $student['username'],
            'role' => 'student',
            'exp' => time() + 3600 
        ));
        echo json_encode([
            'student' => $student,
            'message' => 'Student signed up successfully',
            'token' => $token
        ]);
    }
    else {
        echo json_encode(['message' => 'Error signing up student']);
    }
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
            echo json_encode([
                'student' => $student,
                'message' => 'Login successful!',
                'token' => $token]);
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

    // get all student
    public function getAllStudent() {
        $student = $this->studentModel->getStudents();

        if ($student) {
            echo json_encode(['student' => $student]);
        } else {
            echo json_encode(['message' => 'Student not found']);
        }
    }

    // update student
    public function updateStudent($id, $input) {
        if (isset($input['username'], $input['email'], $input['password'], $input['student_number'])) {
            $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
            $result = $this->studentModel->updateStudent($id, $input['username'], $input['email'], $hashedPassword, $input['student_number']);

            echo json_encode(['message' => $result]);
        } else {
            echo json_encode(['message' => 'Missing fields for update']);
        }
    }

    // delete student
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
