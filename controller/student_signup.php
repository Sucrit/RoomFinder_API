<?php

require_once '../models/student.php';

class StudentSignupController {

    private $studentModel;

    public function __construct() {
        $this->studentModel = new StudentModel();
    }

    // create student
    public function createStudent($username, $email, $password, $student_number) {
        $student = $this->studentModel->createStudent($username, $email, $password, $student_number);

        if ($student) {
            echo json_encode(['message' => 'Student signed up successfully', 'student' => $student]);
        } else {
            echo json_encode(['message' => 'Error signing up student']);
        }
    }
}

?>
