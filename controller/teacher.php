<?php

require_once '../models/teacher.php';

class TeacherController {

    private $teacherModel;

    public function __construct() {
        $this->teacherModel = new TeacherModel();
    }
    
public function createTeacher($name, $email, $password) {
    $existingTeacher = $this->teacherModel->getTeacherByEmail($email);
    if ($existingTeacher) {
        echo json_encode(['message' => 'Teacher already exists with this email']);
        return;
    }

    // create teacher
    $teacher = $this->teacherModel->createTeacher($name, $email, $password);

    if ($teacher) {
        $token = JwtHelper::encode(array(
            'id' => $teacher['id'],
            'username' => $teacher['username'],
            'role' => 'teacher',
            'exp' => time() + 3600 
        ));
        echo json_encode([
            'teacher' => $teacher,
            'message' => 'Teacher signed up successfully',
            'token' => $token
        ]);
    } else {
        echo json_encode(['message' => 'Error signing up teacher']);
    }
}

    // login teacher 
    public function loginTeacher($email, $password) {
        $teacher = $this->teacherModel->getTeacherByEmail($email);
 
        if (!$teacher) {
            echo json_encode(['message' => 'No teacher found with this email']);
            return;
        }
        if (password_verify($password, $teacher['password'])) {
            echo json_encode(['message' => 'Login successful!', 'teacher' => $teacher]);
        } else {
            echo json_encode(['message' => 'Invalid email or password']);
        }
    }

    // get teacher by ID
    public function getTeacher($id) {
        $teacher = $this->teacherModel->getTeacherById($id);

        if ($teacher) {
            echo json_encode(['teacher' => $teacher]);
        } else {
            echo json_encode(['message' => 'Teacher not found']);
        }
    }

    // update teacher information
    public function updateTeacher($id, $input) {
        if (isset($input['name'], $input['email'], $input['password'])) {
            $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
            $result = $this->teacherModel->updateTeacher($id, $input['name'], $input['email'], $hashedPassword);

            echo json_encode(['message' => $result]);
        } else {
            echo json_encode(['message' => 'Missing fields for update']);
        }
    }

    // delete teacher
    public function deleteTeacher($id) {
        $result = $this->teacherModel->deleteTeacher($id);

        if ($result) {
            echo json_encode(['message' => 'Teacher deleted successfully']);
        } else {
            echo json_encode(['message' => 'Error deleting teacher']);
        }
    }
}
?>
