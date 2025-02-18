<?php
require_once __DIR__ . '/../vendor/autoload.php';

require_once '../controller/admin.php';
require_once '../controller/student.php';
require_once '../controller/room.php';
require_once '../controller/room_request.php';
require_once '../controller/room_schedule.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (strpos($contentType, 'application/json') === false) {
    echo json_encode(['message' => 'Invalid json content type.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// instantiate controllers
$adminController = new AdminController();
$studentController = new StudentController();
$roomController = new RoomController();
$roomRequestController = new RoomRequestController();
$roomScheduleController = new RoomScheduleController();

// student method handler
function handleStudent($requestMethod, $uri, $input, $studentController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/student\/(\d+)/', $uri, $matches)) {
                $studentController->getStudent($matches[1]);
            } elseif (preg_match('/\/student/', $uri)) {
                $studentController->getAllStudent();
            } else {
                echo json_encode(['message' => 'Invalid student request']);
            }
            break;

        case 'POST':
            if (preg_match('/\/student\/signup/', $uri)) {
                // student signup
                if (isset($input['username'], $input['email'], $input['password'], $input['student_number'])) {
                    $studentController->createStudent($input['username'], $input['email'], $input['password'], $input['student_number']);
                } else {
                    echo json_encode(['message' => 'Missing required fields for signup']);
                }
            } elseif (preg_match('/\/student\/login/', $uri)) {
                //  student login
                if (isset($input['email'], $input['password'])) {
                    $studentController->loginStudent($input['email'], $input['password']);
                } else {
                    echo json_encode(['message' => 'Missing email or password']);
                }
            } else {
                echo json_encode(['message' => 'Invalid student request']);
            }
            break;

        case 'PUT':
            if (preg_match('/\/student\/(\d+)/', $uri, $matches)) {
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
            if (preg_match('/\/student\/(\d+)/', $uri, $matches)) {
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

// room method handler
function handleRoom($requestMethod, $uri, $input, $roomController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/room\/(\d+)/', $uri, $matches)) {
                $roomController->getRoom($matches[1]);
            } elseif (preg_match('/\/room/', $uri)) {
                $roomController->getRooms();
            } else {
                echo json_encode(['message' => 'Invalid room request', 'status' => '404']);
            }
            break;

        case 'POST':
            if (preg_match('/\/room/', $uri)) {
                if (isset($input['name'], $input['status'], $input['availability'], $input['equipment'], $input['capacity'], $input['room_type'])) {
                    $roomController->createRoom($input['name'], $input['status'], $input['availability'], $input['equipment'], $input['capacity'], $input['room_type']);
                } else {
                    echo json_encode(['message' => 'Missing required fields for room creation', 'status' => '400']);
                }
            } else {
                echo json_encode(['message' => 'Invalid room request', 'status' => '404']);
            }
            break;

        case 'PUT':
            if (preg_match('/\/room\/(\d+)/', $uri, $matches)) {
                $roomController->updateRoom($matches[1], $input);
            } else {
                echo json_encode(['message' => 'Invalid room ID for update', 'status' => '400']);
            }
            break;

        case 'DELETE':
            if (preg_match('/\/room\/(\d+)/', $uri, $matches)) {
                $roomController->deleteRoomById($matches[1]);
            } else {
                echo json_encode(['message' => 'Invalid room ID for deletion', 'status' => '400']);
            }
            break;

        default:
            echo json_encode(['message' => 'Room method not supported', 'status' => '405']);
            break;
    }
}

// room request method handler
function handleRoomRequest($requestMethod, $uri, $input, $roomRequestController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/room_request\/student\/(\d+)/', $uri, $matches)) {
                $roomRequestController->getRoomRequestsByStudent($matches[1]);
            } elseif (preg_match('/\/room_request/', $uri)) {
                $roomRequestController->getRoomRequests();
            } else {
                echo json_encode(['message' => 'Invalid room request']);
            }
            break;

        case 'POST':
            if (isset($input['room_id'], $input['student_id'], $input['purpose'], $input['starting_time'], $input['ending_time'], $input['receiver'])) {
                $roomRequestController->createRoomRequest($input['room_id'], $input['student_id'], $input['purpose'], $input['starting_time'], $input['ending_time'], $input['receiver']);
            } else {
                echo json_encode(['message' => 'Missing required fields to create room request']);
            }
            break;

        case 'DELETE':
            if (preg_match('/\/room_request\/(\d+)/', $uri, $matches)) {
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

// Room schedule method handler
function handleRoomSchedule($requestMethod, $uri, $input, $roomScheduleController) {
    switch ($requestMethod) {
        case 'GET':
            // Match '/room_schedules/room/{id}'
            if (preg_match('/\/room_schedule\/room\/(\d+)/', $uri, $matches)) {
                $roomScheduleController->getRoomSchedulesOfRoom($matches[1]);
            }
            elseif (preg_match('/\/room_schedule\/(\d+)/', $uri, $matches)) {
                $roomScheduleController->getRoomSchedule($matches[1]);
            }
         else {
                echo json_encode(['message' => 'Invalid room schedule request']);
            }
            break;

        case 'POST':
            if (isset($input['room_id'], $input['block'], $input['starting_time'], $input['ending_time'])) {
                $roomScheduleController->createRoomSchedule($input['room_id'], $input['block'], $input['starting_time'], $input['ending_time']);
            } else {
                echo json_encode(['message' => 'Missing required fields to create room schedule']);
            }
            break;

        case 'PUT':
            if (preg_match('/\/room_schedule\/(\d+)/', $uri, $matches)) {
                $roomScheduleController->updateRoomSchedule($matches[1], $input['room_id'], $input['block'], $input['starting_time'], $input['ending_time']);
            } else {
                echo json_encode(['message' => 'Invalid room schedule ID for update']);
            }
            break;

        case 'DELETE':
            if (preg_match('/\/room_schedule\/(\d+)/', $uri, $matches)) {
                $roomScheduleController->deleteRoomSchedule($matches[1]);
            } else {
                echo json_encode(['message' => 'Invalid room schedule ID for deletion']);
            }
            break;

        default:
            echo json_encode(['message' => 'Room schedule method not supported']);
            break;
    }
}

// admin method handler
function handleAdmin($requestMethod, $uri, $input, $AdminController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/admin\/(\d+)/', $uri, $matches)) {
                $AdminController->getAdmin($matches[1]);
            } elseif (preg_match('/\/admin/', $uri)) {
                $AdminController->getAllAdmin();
            } else {
                echo json_encode(['message' => 'Invalid admin request']);
            }
            break;

        case 'POST':
            if (preg_match('/\/admin\/signup/', $uri)) {
                // admin signup
                if (isset($input['username'], $input['email'], $input['password'])) {
                    $AdminController->createAdmin($input['username'], $input['email'], $input['password']);
                } else {
                    echo json_encode(['message' => 'Missing required fields']);
                }
            } elseif (preg_match('/\/admin\/login/', $uri)) {
                // admin login
                if (isset($input['email'], $input['password'])) {
                    $AdminController->loginAdmin($input['email'], $input['password']);
                } else {
                    echo json_encode(['message' => 'Missing email or password']);
                }
            } else {
                echo json_encode(['message' => 'Invalid admin request']);
            }
            break;

        case 'PUT':
            if (preg_match('/\/admin\/(\d+)/', $uri, $matches)) {
                $id = $matches[1];
                if (!empty($input)) {
                    $AdminController->updateAdmin($id, $input);
                } else {
                    echo json_encode(['message' => 'No fields to update']);
                }
            } else {
                echo json_encode(['message' => 'Invalid admin ID']);
            }
            break;

        case 'DELETE':
            if (preg_match('/\/admin\/(\d+)/', $uri, $matches)) {
                $AdminController->deleteAdmin($matches[1]);
            } else {
                echo json_encode(['message' => 'Invalid admin ID']);
            }
            break;

        default:
            echo json_encode(['message' => 'Method not supported']);
            break;
    }
}

// main request routing
if (preg_match('/\/admin/', $uri)) {
    handleAdmin($requestMethod, $uri, $input, $adminController);
} elseif (preg_match('/\/room_request/', $uri)) {
    handleRoomRequest($requestMethod, $uri, $input, $roomRequestController);
} elseif (preg_match('/\/room_schedule/', $uri)) {
    handleRoomSchedule($requestMethod, $uri, $input, $roomScheduleController);
}elseif (preg_match('/\/student/', $uri)) {
    handleStudent($requestMethod, $uri, $input, $studentController);
} elseif (preg_match('/\/room/', $uri)) {
    handleRoom($requestMethod, $uri, $input, $roomController);
} else {
    echo json_encode(['message' => 'Invalid request']);
}
?>
