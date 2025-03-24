<?php

// VIEW

// website access controls
header("Access-Control-Allow-Origin: *");  
header("Access-Control-Allow-Headers: Content-Type, Authorization");  
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PATCH, DELETE");  

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
$input = json_decode(file_get_contents('php://input'), true);

if (strpos($contentType, 'application/json') === false) {
    echo json_encode(['message' => 'Invalid json content type.']);
    exit;
}

// instantiate controllers
$adminController = new AdminController();
$userController = new UserController();
$roomController = new RoomController();
$roomRequestController = new RoomRequestController();
$roomScheduleController = new RoomScheduleController();



// user method handler
function handleUser($requestMethod, $uri, $input, $userController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/user\/(\d+)/', $uri, $matches)) {
                // get user by id
                $userController->getUser($matches[1]);
            } 
            else {
                echo json_encode(['message' => 'Invalid user request']);
            }
            break;

        case 'POST':
            if (preg_match('/\/user\/login/', $uri)) {
                // teacher login
                if (isset($input['email'], $input['password'])) {
                    $userController->loginUser($input['email'], $input['password']);
                } 
                else {
                    echo json_encode(['message' => 'Missing email or password']);
                }
            } 
            elseif (preg_match('/\/user\/logout/', $uri)) {
                // teacher logout
                $Authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
                if ($Authorization) {
                    // invalidate token if token is authorized
                    $userController->logoutUser($Authorization);    
                } 
                else {
                    echo json_encode(['message' => 'Authorization token is missing']);
                }
            }    else {
                echo json_encode(['message' => 'Invalid user request']);
            }
            break;

        case 'PATCH':
            if (preg_match('/\/user\/(\d+)/', $uri, $matches)) {
                $id = $matches[1];
                if (!empty($input)) {
                    // check if variable old, new, confirm pass (change pass)
                    if (isset($input['old_password']) && isset($input['new_password']) && isset($input['confirm_password'])) {
                        $oldPassword = $input['old_password'];
                        $newPassword = $input['new_password'];
                        $confirmPassword = $input['confirm_password'];
                        $userController->changePassword($id, $oldPassword, $newPassword, $confirmPassword);
                    } 
                    else {
                        // use update user profile
                        $userController->updateUser($id, $input);
                    }
                } 
                else {
                    echo json_encode(['message' => 'No fields to update']);
                }
            } 
            else {
                echo json_encode(['message' => 'Invalid user ID']);
            }
            break;
                    
        case 'DELETE':
            if (preg_match('/\/user\/(\d+)/', $uri, $matches)) {
                $userController->deleteUserById($matches[1]);
            } 
            else {
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
                } 
                else {
                    echo json_encode(['message' => 'Missing required fields for room creation', 'status' => '400']);
                }
            } 
            else {
                echo json_encode(['message' => 'Invalid room request']);
            }
            break;

        case 'PATCH':
            if (preg_match('/\/room\/(\d+)/', $uri, $matches)) {
                $roomController->updateRoom($matches[1], $input);
            } 
            else {
                echo json_encode(['message' => 'Invalid room ID for update', 'status' => '400']);
            }
            break;

        case 'DELETE':
            if (preg_match('/\/room\/(\d+)/', $uri, $matches)) {
                $roomController->deleteRoomById($matches[1]);
            } 
            else {
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
            if (preg_match('/\/room_request\/pending_request/', $uri)) {
                $roomRequestController->getAllPendingRoomRequest();
            } 
            elseif (preg_match('/\/room_request\/history/', $uri)) {
                $roomRequestController->getRoomRequestHistory();
            } 
            elseif (preg_match('/\/room_request\/user\/(\d+)/', $uri, $matches)) {
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
            if (isset($input['room_id'], $input['user_id'], $input['purpose'], $input['date'], $input['starting_time'], $input['ending_time'])) {
                $block = isset($input['block']) ? $input['block'] : '';
                $roomRequestController->createRoomRequest($input['room_id'], $input['user_id'], $block, $input['purpose'], $input['date'], $input['starting_time'], $input['ending_time']);
            } 
            else {
                echo json_encode(['message' => 'Missing required fields to create room request']);
            }
            break;

        case 'PATCH':
            if (preg_match('/\/room_request\/(\d+)/', $uri, $matches)) {
                $id = $matches[1]; 
                
                if (isset($input['status']) && in_array($input['status'], ['Approved', 'Rejected'])) {
                    $roomRequestController->updateRoomRequestStatus($id, $input['status']);
                } 
                else {
                    echo json_encode(['message' => 'Only approved or rejected status update is allowed']);
                }
            } 
            else {
                echo json_encode(['message' => 'Invalid room request ID or missing status']);
            }
            break;

        case 'DELETE':
            if (preg_match('/\/room_request\/(\d+)/', $uri, $matches)) {
                $roomRequestController->deleteRoomRequest($matches[1]);
            } 
            else {
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
            if (preg_match('/\/room_schedule\/ongoing_schedule/', $uri)) {
                $roomScheduleController->getAllOngoingSchedules();
            } 
            elseif (preg_match('/\/room_schedule\/room\/(\d+)/', $uri, $matches)) {
                $roomScheduleController->getRoomSchedulesOfRoom($matches[1]);
            } 
            elseif (preg_match('/\/room_schedule\/(\d+)/', $uri, $matches)) {
                $roomScheduleController->getRoomSchedule($matches[1]);
            } 
            elseif (preg_match('/\/room_schedule/', $uri)) {
                $roomScheduleController->getAllRoomSchedule();
            } 
            else {
                echo json_encode(['message' => 'Invalid room schedule request']);
            }
            break;

        case 'POST':
            if (isset($input['room_id'], $input['block'], $input['date'], $input['starting_time'], $input['ending_time'])) {
                $roomScheduleController->createRoomSchedule($input['room_id'], $input['block'], $input['date'], $input['starting_time'], $input['ending_time']);
            } 
            else {
                echo json_encode(['message' => 'Missing required fields to create room schedule']);
            }
            break;

        case 'PATCH':
            if (preg_match('/\/room_schedule\/(\d+)/', $uri, $matches)) {
                $roomScheduleController->updateRoomSchedule($matches[1], $input);
            } 
            else {
                echo json_encode(['message' => 'Invalid room schedule ID for update']);
            }
            break;

        case 'DELETE':
            if (preg_match('/\/room_schedule\/(\d+)/', $uri, $matches)) {
                $roomScheduleController->deleteRoomSchedule($matches[1]);
            } 
            else {
                echo json_encode(['message' => 'Invalid room schedule ID for deletion']);
            }
            break;

        default:
            echo json_encode(['message' => 'Room schedule method not supported']);
            break;
    }
}

// admin request method handler
function handleAdmin($requestMethod, $uri, $input, $adminController, $userController) {
    switch ($requestMethod) {
        case 'GET':
            if (preg_match('/\/admin\/(\d+)/', $uri, $matches)) {
                $adminController->getAdmin($matches[1]);
            } 
            elseif (preg_match('/\/admin/', $uri)) {
                $adminController->getAllUsersAndAdmin();
            } 
            else {
                echo json_encode(['message' => 'Invalid admin request']);
            }
            break;

        case 'POST':
            if (preg_match('/\/admin\/signup/', $uri)) {
                // create administrators, staff, and teachers
                if (isset($input['username'], $input['email'], $input['password'], $input['role'])) {
                    $role = $input['role']; 
                    if ($role === 'Teacher') {
                        if (isset($input['teacher_id'])) {
                            $userController->createUser($input['teacher_id'], $input['username'], $input['email'], $input['password'], $input['role']);
                        } 
                        else {
                            echo json_encode(['message' =>'Teacher ID is missing']);
                        }
                    } 
                    elseif ($role === 'Administrator' || $role === 'Staff') {
                        // add to the admin table if the role is admin or staff
                        $adminController->createAdmin($input['username'], $input['email'], $input['password'], $input['role']);
                    } 
                    else {
                        echo json_encode(['message' => 'Invalid role specified']);
                    }
                } 
                else {
                    echo json_encode(['message' => 'Missing required fields']);
                }
            } 
            elseif (preg_match('/\/admin\/login/', $uri)) {
                // admin login
                if (isset($input['email'], $input['password'])) {
                    $adminController->loginAdmin($input['email'], $input['password']);
                } 
                else {
                    echo json_encode(['message' => 'Missing email or password']);
                }
            } 
            elseif (preg_match('/\/admin\/logout/', $uri)) {
                // admin or staff logout
                $Authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
                if ($Authorization) {
                    // invalidate token if token is authorized
                    $adminController->logoutAdmin($Authorization);
                } 
            }
            break;

        case 'PATCH':
            if (preg_match('/\/admin\/(\d+)/', $uri, $matches)) {
                $id = $matches[1];
                if (!empty($input)) {
                // check if variable old, new, confirm pass is present
                if (isset($input['old_password']) && isset($input['new_password']) && isset($input['confirm_password'])) {
                    $oldPassword = $input['old_password'];
                    $newPassword = $input['new_password'];
                    $confirmPassword = $input['confirm_password'];
                    $adminController->changePassword($id, $oldPassword, $newPassword, $confirmPassword);
                } 
                else {
                    // update other input values via updateAdmin
                    $adminController->updateAdmin($id, $input);
                }
            } else {
                echo json_encode(['message' => 'No fields to update']);
            }
        } else {
            echo json_encode(['message' => 'Invalid user ID']);
        }
        break;

        case 'DELETE':
            if (preg_match('/\/admin\/(\d+)/', $uri, $matches)) {
                $adminController->deleteAdminById($matches[1]);
            } 
            else {
                echo json_encode(['message' => 'Invalid admin ID']);
            }
            break;
        default:
            echo json_encode(['message' => 'Method not supported']);
            break;
    }
}

// main request routing (fix pattern execution logic)
if (preg_match('/\/admin/', $uri)) {
    if (!preg_match('/\/admin\/login/', $uri) && !preg_match('/\/admin\/logout/', $uri)) {
        AuthMiddleware::verifyToken();
    }
    handleAdmin($requestMethod, $uri, $input, $adminController, $userController);
} 
elseif (preg_match('/\/room_request/', $uri)) {
    if ($requestMethod !== 'GET') {
        AuthMiddleware::verifyToken(); 
    }
    handleRoomRequest($requestMethod, $uri, $input, $roomRequestController);
} 
elseif (preg_match('/\/room_schedule/', $uri)) {
    if ($requestMethod !== 'GET') {
        AuthMiddleware::verifyToken();
    }
    handleRoomSchedule($requestMethod, $uri, $input, $roomScheduleController);
} 
elseif (preg_match('/\/user/', $uri)) {
    if (!preg_match('/\/user\/login/', $uri) && !preg_match('/\/user\/logout/', $uri)) {
        AuthMiddleware::verifyToken(); 
    }
    handleUser($requestMethod, $uri, $input, $userController);
} 
elseif (preg_match('/\/room/', $uri)) {
    if ($requestMethod !== 'GET') {
        AuthMiddleware::verifyToken(); 
    }
    handleRoom($requestMethod, $uri, $input, $roomController);
} 
else {
    echo json_encode(['message' => 'Invalid request']);
}
?>