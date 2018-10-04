<?php

$host = '127.0.0.1';
$db   = 'workshop';
$user = 'root';
$pass = '';

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
     $pdo = new PDO($dsn, $user, $pass);
     $stmt = $pdo->query('SELECT * FROM sensors');
     $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
     header('Content-Type: application/json');
     echo json_encode($data);
} catch (PDOException $e) {
     throw new PDOException($e->getMessage(), (int)$e->getCode());
}
