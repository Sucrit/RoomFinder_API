<?php

require_once '../controllers/mobile_controller/student.php';
require_once '../controllers/mobile_controller/room.php';
require_once '../controllers/mobile_controller/room_request.php';
require_once '../controllers/mobile_controller/pending_request.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// student controller requests handler
$studentController = new StudentController();
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$input = [];

// Handle raw JSON, URL encoded data
if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
} else if (strpos($contentType, 'application/x-www-form-urlencoded') !== false) {
    $input = $_POST;
}

switch ($requestMethod) {
    case 'GET':
        if (isset($uri) && preg_match('/\/student\/(\d+)/', $uri, $matches)) {
            $studentController->getStudent($matches[1]);
        } else {
            echo json_encode(['message' => 'Missing student']);
        }
        break;

        case 'POST':
            if (isset($input['username'], $input['email'], $input['password'], $input['student_number'])) {
                $studentController->createStudent($input['username'], $input['email'], $input['password'], $input['student_number']);
            } else {
                echo json_encode(['message' => 'Missing required fields']);
            }
            break;
        
        case 'PUT':
            if (isset($uri) && preg_match('/\/student\/(\d+)/', $uri, $matches)) {
                $id = $matches[1]; 
                if (!empty($input)) {
                    $studentController->updateStudent($id, $input); 
                } else {
                    echo json_encode(['message' => 'No fields to update']);
                }
            } else {
                echo json_encode(['message' => 'Invalid student ID']);
            }
            break;
        
    case 'DELETE':
        if (isset($uri) && preg_match('/\/student\/(\d+)/', $uri, $matches)) {
            $studentController->deleteStudent($matches[1]);
        } else {
            echo json_encode(['message' => 'Invalid student ID']);
        }
        break;

    default:
        echo json_encode(['message' => 'Method not supported']);
        break;
}
?>
