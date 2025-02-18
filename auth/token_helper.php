<?php

use \Firebase\JWT\JWT;

class JwtHelper {

    private static $secretKey = 'roomfinder'; 

    // encode data to convert to jwt token
    public static function encode($data) {
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600;  // jwt valid time = 1 hour
        $payload = array(
            "iat" => $issuedAt,
            "exp" => $expirationTime,
            "data" => $data
        );
        // return the encoded JWT token
        return JWT::encode($payload, self::$secretKey, 'HS256');
    }

    public static function decode($jwt) {
        try {
            // decode valid jwt token
            $decoded = JWT::decode($jwt, self::$secretKey, $allowedAlgorithms);
            return (array) $decoded->data;
        } catch (Exception $e) {
            echo json_encode(['message' => 'JWT Decode Failed', 'error' => $e->getMessage()]);
            return null;
        }
    }
    
    
}

?>
