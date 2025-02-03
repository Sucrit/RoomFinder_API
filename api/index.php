<?php

require_once '../controller/student.php';
require_once '../controller/room.php';
require_once '../controller/room_request.php';
require_once '../controller/pending_request.php';
require_once '../controller/admin.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

// handle json or url data
$input = [];
if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
} else if (strpos($contentType, 'application/x-www-form-urlencoded') !== false) {
    $input = $_POST;
}

// instantiate controllers
$studentController = new StudentController();
$roomController = new RoomController();
$roomRequestController = new RoomRequestController();
$adminController = new AdminController();

//student request handler
function StudentMethod($requestMethod, $uri, $input, $studentController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/student\/(\d+)/', $uri, $matches)) {
                // If an ID is provided, get a specific student
                $studentController->getStudent($matches[1]);
            } else if (preg_match('/\/student/', $uri)) {
                // If no ID is provided, get all students
                $studentController->getStudents();
            } else {
                echo json_encode(['message' => 'Invalid student request']);
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
}
// room request handler
function RoomMethod($requestMethod, $uri, $input, $roomController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/room\/(\d+)/', $uri, $matches)) {
                $roomController->getRoom($matches[1]);
            } else if (preg_match('/\/room/', $uri)) {
                $roomController->getRooms();
            } else {
                echo json_encode(['message' => 'Invalid room request']);
            }
            break;

        default:
            echo json_encode(['message' => 'Room method not supported']);
            break;
            case 'PUT':
                if (isset($uri) && preg_match('/\/room\/(\d+)/', $uri, $matches)) {
                    if (isset($input['room_name'], $input['room_type'], $input['capacity'])) {
                        $roomController->updateRoom($matches[1], $input['room_name'], $input['room_type'], $input['capacity']);
                    } else {
                        echo json_encode(['message' => 'Missing fields to update room']);
                    }
                } else {
                    echo json_encode(['message' => 'Invalid room ID']);
                }
                break;
    
            case 'DELETE':
                // Delete a room by ID
                if (isset($uri) && preg_match('/\/room\/(\d+)/', $uri, $matches)) {
                    $roomController->deleteRoom($matches[1]);
                } else {
                    echo json_encode(['message' => 'Invalid room ID']);
                }
                break;
    }
}
// form request handler
 function RoomRequestMethod($requestMethod, $uri, $input, $roomRequestController) {
    switch ($requestMethod) {
            case 'GET':
                var_dump($input);
                if (preg_match('/\/room_request\/(\d+)/', $uri, $matches)) {
                    // Get a specific room request by ID
                    $roomRequestController->getRoomRequest($matches[1]);
                } else if (preg_match('/\/room_request/', $uri)) {
                    // Get all room requests
                    $roomRequestController->getRoomRequests();
                } else {
                    echo json_encode(['message' => 'Invalid room request']);
                }
                break;
    
            case 'POST':
                if (isset($input['room_id'], $input['student_id'], $input['purpose'], $input['starting_time'], $input['ending_time'], $input['receiver'])) {
                    $roomRequestController->createRoomRequest(
                        $input['room_id'],$input['student_id'],$input['purpose'],$input['starting_time'],$input['ending_time'],$input['receiver']);
                } else {
                    echo json_encode(['message' => 'Missing required fields to create room request']);
                }
                break;
    
            case 'PUT':
                if (isset($uri) && preg_match('/\/room_request\/(\d+)/', $uri, $matches)) {
                    if (isset($input['room_id'], $input['student_id'], $input['purpose'], $input['starting_time'], $input['ending_time'], $input['receiver'])) {
                        $roomRequestController->updateRoomRequest(
                            $matches[1],
                            $input['room_id'],$input['purpose'],$input['starting_time'],$input['ending_time'],$input['receiver']
                        );
                    } else {
                        echo json_encode(['message' => 'Missing fields to update room request']);
                    }
                } else {
                    echo json_encode(['message' => 'Invalid room request ID']);
                }
                break;

            case 'DELETE':
                if (isset($uri) && preg_match('/\/room_request\/(\d+)/', $uri, $matches)) {
                    $roomRequestController->deleteRoomRequest($matches[1]);
                } else {
                    echo json_encode(['message' => 'Invalid room request ID']);
                }
                break;
    
            default:
                echo json_encode(['message' => 'Room request method not supported']);
                break;
    }

}   
 function AdminMethod($requestMethod, $uri, $input, $adminController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/admin\/(\d+)/', $uri, $matches)) {
                $adminController->getAdmin($matches[1]);
            } else if (preg_match('/\/admin/', $uri)) {
                $adminController->getAdmins();
            } else {
                echo json_encode(['message' => 'Invalid admin request']);
            }
            break;

        case 'POST':
            if (isset($input['username'], $input['email'], $input['password'])) {
                $adminController->createAdmin($input['username'], $input['email'], $input['password']);
            } else {
                echo json_encode(['message' => 'Missing required fields']);
            }
            break;

        case 'PUT':
            if (preg_match('/\/admin\/(\d+)/', $uri, $matches)) {
                $id = $matches[1];
                if (!empty($input)) {
                    $adminController->updateAdmin($id, $input);
                } else {
                    echo json_encode(['message' => 'No fields to update']);
                }
            } else {
                echo json_encode(['message' => 'Invalid admin ID']);
            }
            break;

        case 'DELETE':
            if (preg_match('/\/admin\/(\d+)/', $uri, $matches)) {
                $adminController->deleteAdmin($matches[1]);
            } else {
                echo json_encode(['message' => 'Invalid admin ID']);
            }
            break;

        default:
            echo json_encode(['message' => 'Method not supported']);
            break;
    }
}

// Main request routing
if (preg_match('/\/student/', $uri)) {
    StudentMethod($requestMethod, $uri, $input, $studentController);
} elseif (preg_match('/\/room_request/', $uri)) {
    RoomRequestMethod($requestMethod, $uri, $input, $roomRequestController);
} elseif (preg_match('/\/room/', $uri)) {
    RoomMethod($requestMethod, $uri, $input, $roomController);
} elseif (preg_match('/\/admin/', $uri)) { // Admin route
    AdminMethod($requestMethod, $uri, $input, $adminController);
} else {
    echo json_encode(['message' => 'Invalid request']);
}

?>
