<?php
// token handler
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../auth/middleware.php';

// controllers
require_once '../controller/admin.php';
require_once '../controller/user.php';
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
$userController = new UserController();
$roomController = new RoomController();
$roomRequestController = new RoomRequestController();
$roomScheduleController = new RoomScheduleController();

// user method handler
function handleUser($requestMethod, $uri, $input, $UserController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/user\/(\d+)/', $uri, $matches)) {
                // get user by id
                $UserController->getUser($matches[1]);
            } elseif (preg_match('/\/user/', $uri)) {
                // get all users
                $UserController->getAllUsers();
            } else {
                echo json_encode(['message' => 'Invalid user request']);
            }
            break;

        case 'POST':
            if (preg_match('/\/user\/signup/', $uri)) {
                // user signup (student, teacher)
                if (isset($input['username'], $input['email'], $input['password'], $input['role'])) {
                    $UserController->createUser($input['username'], $input['email'], $input['password'], $input['role']);
                } else {
                    echo json_encode(['message' => 'Missing required fields for signup']);
                }
            } elseif (preg_match('/\/user\/login/', $uri)) {
                // user login (student, teacher)
                if (isset($input['email'], $input['password'])) {
                    $UserController->loginUser($input['email'], $input['password']);
                } else {
                    echo json_encode(['message' => 'Missing email or password']);
                }
            } elseif (preg_match('/\/user\/logout/', $uri)) {
                // user logout
                $Authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
                if ($Authorization) {
                    // invalidate token if token is authorized
                    $UserController->logoutUser($Authorization); 
                    echo json_encode(['message' => 'User logged out successfully']);
                } else {
                    echo json_encode(['message' => 'Authorization token is missing']);
                }
            } else {
                echo json_encode(['message' => 'Invalid user request']);
            }
            break;

        case 'PATCH':
            if (preg_match('/\/user\/(\d+)/', $uri, $matches)) {
                $id = $matches[1];
                if (!empty($input)) {
                    // check if variable old, new, confirm pass is present
                    if (isset($input['old_password']) && isset($input['new_password']) && isset($input['confirm_password'])) {
                        $oldPassword = $input['old_password'];
                        $newPassword = $input['new_password'];
                        $confirmPassword = $input['confirm_password'];
                        $UserController->changePassword($id, $oldPassword, $newPassword, $confirmPassword);
                    } else {
                        // update other input values via updateUser 
                        $UserController->updateUser($id, $input);
                    }
                } else {
                    echo json_encode(['message' => 'No fields to update']);
                }
            } else {
                echo json_encode(['message' => 'Invalid user ID']);
            }
            break;
                      
        case 'DELETE':
            if (preg_match('/\/user\/(\d+)/', $uri, $matches)) {
                $UserController->deleteUser($matches[1]);
            } else {
                echo json_encode(['message' => 'Invalid user ID']);
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
                if (isset($_GET['keyword'])) { 
                    $input['keyword'] = $_GET['keyword'];  
                    $roomController->searchRooms($input);  
                }
                 else {
                    $roomController->getRooms();
                }
            }  else {
                echo json_encode(['message' => 'Invalid room request']);
            }
            break;

        case 'POST':
            if (preg_match('/\/room/', $uri)) {
                if (isset($input['room_building'], $input['room_number'], $input['status'], $input['equipment'], $input['capacity'], $input['room_type'])) {
                    $roomController->createRoom($input['room_building'], $input['room_number'], $input['status'], $input['equipment'], $input['capacity'], $input['room_type']);
                } else {
                    echo json_encode(['message' => 'Missing required fields for room creation', 'status' => '400']);
                }
            } else {
                echo json_encode(['message' => 'Invalid room request']);
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
            echo json_encode(['message' => 'Invalid room request']);
            break;
    }
}

// room request method handler
function handleRoomRequest($requestMethod, $uri, $input, $roomRequestController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/room_request\/user\/(\d+)/', $uri, $matches)) {
                $roomRequestController->getRoomRequestsByStudent($matches[1]);
            } 
            elseif (preg_match('/\/room_request\/(\d+)/', $uri, $matches)) {
                $id = $matches[1]; 
                $roomRequestController->getRoomRequest($id);
            } 
            elseif (preg_match('/\/room_request/', $uri)) {
                $roomRequestController->getRoomRequests();
            }            
            else {
                echo json_encode(['message' => 'Invalid room request']);
            }
            break;

        case 'POST':
            if (isset($input['room_id'], $input['user_id'], $input['block'], $input['purpose'], $input['date'], $input['starting_time'], $input['ending_time'])) {
                $roomRequestController->createRoomRequest($input['room_id'], $input['user_id'], $input['block'], $input['purpose'], $input['date'], $input['starting_time'], $input['ending_time']);
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

// room schedule method handler
function handleRoomSchedule($requestMethod, $uri, $input, $roomScheduleController) {
    switch ($requestMethod) {
        case 'GET':
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
            if (isset($input['room_id'], $input['block'], $input['date'], $input['starting_time'], $input['ending_time'])) {
                $roomScheduleController->createRoomSchedule($input['room_id'], $input['block'], $input['date'], $input['starting_time'], $input['ending_time']);
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
            } elseif (preg_match('/\/admin\/logout/', $uri)) {
                $AdminController->logoutAdmin();
                echo json_encode(['message' => 'Admin logged out successfully']);
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

// main request routing (fix pattern execution logical error)
if (preg_match('/\/admin/', $uri)) {
    handleAdmin($requestMethod, $uri, $input, $adminController);
} elseif (preg_match('/\/room_request/', $uri)) {
    handleRoomRequest($requestMethod, $uri, $input, $roomRequestController);
} elseif (preg_match('/\/room_schedule/', $uri)) {
    handleRoomSchedule($requestMethod, $uri, $input, $roomScheduleController);
} elseif (preg_match('/\/user/', $uri)) {
    handleUser($requestMethod, $uri, $input, $userController);
} elseif (preg_match('/\/room/', $uri)) {
    handleRoom($requestMethod, $uri, $input, $roomController);
} else {
    echo json_encode(['message' => 'Invalid request']);
}
?>
