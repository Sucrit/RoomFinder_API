<?php

require_once 'auth/token_helper.php';

class AuthMiddleware {

    public static function verifyToken() {
        $headers = apache_request_headers();
        // middleware security for important routes
    }
}
?>
