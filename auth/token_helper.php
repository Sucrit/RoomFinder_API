<?php

use Firebase\JWT\JWT;

class JwtHelper {

    private static $secretKey = 'roomfinder'; 

    // encode token
    public static function encode($data) {
        $issuedAt = time(); 
        $expirationTime = $issuedAt + 3600;  // token validity
        $payload = array(
            "iat" => $issuedAt,  
            "exp" => $expirationTime,  
            "data" => $data,  // id, username, role)
            "id" => $data['id']
        );
        return JWT::encode($payload, self::$secretKey, 'HS256');  // symmetric algo HMAC SHA256
    }

    // decode token 
    public static function decode($jwt) {
        // split jwt into 3 components. header, payload, signature
        $parts = explode('.', $jwt);
        if (count($parts) != 3) {
            throw new Exception("Invalid JWT token format");
        }

        // decode header and payload from base64url
        $header = json_decode(self::base64UrlDecode($parts[0]), true);
        $payload = json_decode(self::base64UrlDecode($parts[1]), true);

        // get token algo from token header
        $algorithm = $header['alg']; 
        // algo restriction
        if ($algorithm !== 'HS256') {
            throw new Exception("Invalid algorithm");
        }

        // check token expiration
        $currentTime = time();
        if (isset($payload['exp']) && $payload['exp'] < $currentTime) {
            throw new TokenExpiredException("Token has expired"); 
        }

        // payload data
        return $payload;
    }

    // decode base64url encoded string
    private static function base64UrlDecode($data) {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $padlen = 4 - $remainder;
            $data .= str_repeat('=', $padlen);
        }

        return base64_decode(strtr($data, '-_', '+/'));
    }
}

// token expiry exception
class TokenExpiredException extends Exception {
    public function __construct($message) {
        parent::__construct($message);
    }
}

?>
