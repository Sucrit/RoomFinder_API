<?php

require_once '../models/student.php';

class StudentController {

    private $studentModel;

    public function __construct() {
        $this->studentModel = new StudentModel();
    }

    public function getStudents() {
        $students = $this->studentModel->getStudents();
        if (empty($students)) {
            echo json_encode(['message' => 'No students found']);
        } else {
            echo json_encode($students);
        }
    }

    public function getStudent($id) {
        $student = $this->studentModel->getStudentById($id);
        if ($student === null) {
            echo json_encode(['message' => 'Student not found']);
        } else {
            echo json_encode($student);
        }
    }

    public function createStudent($username, $email, $password, $student_number) {
        $student = $this->studentModel->createStudent($username, $email, $password, $student_number);
    
        if (is_array($student)) {
            echo json_encode(['message' => 'Student created successfully!', 'student' => $student]);
        } else {
            echo json_encode(['message' => $student]);
        }
    }

    public function updateStudent($id, $input) {
        $student = $this->studentModel->getStudentById($id);
        if (!$student) {
            echo json_encode(['message' => 'Student not found']);
            return;
        }
        $username = isset($input['username']) ? $input['username'] : $student['username'];
        $email = isset($input['email']) ? $input['email'] : $student['email'];
        $password = isset($input['password']) && !empty($input['password']) ? password_hash($input['password'], PASSWORD_DEFAULT) : $student['password'];
        $student_number = isset($input['student_number']) ? $input['student_number'] : $student['student_number'];
        // only get the changed value of a variable
        $updateResult = $this->studentModel->updateStudent($id, $username, $email, $password, $student_number);
        echo json_encode(['message' => $updateResult]);
    }    
    
    public function deleteStudent($id) {
        $message = $this->studentModel->deleteStudent($id);
        echo json_encode(['message' => $message]);
    }
}
?>
