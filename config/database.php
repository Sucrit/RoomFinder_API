<?php

class Database {
    private $host = 'localhost';
    private $db_name = 'roomfinder_db';
    private $username = 'root';
    private $password = '';
    public $conn;

    public function connect() {
        $this->conn = null;
        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
            if ($this->conn->connect_error) {
                die("Connection failed: " . $this->conn->connect_error);
            }
            return $this->conn;
        } catch (Exception $e) {
            echo "Database connection error: " . $e->getMessage();
            return null;
        }
    }
}
?>
