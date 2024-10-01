<?php
var_dump($_POST); exit;
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// เชื่อมต่อฐานข้อมูล
$servername = "localhost";
$username = "arm2024_ronren"; 
$password = "123456789";
$dbname = "arm2024_ronren";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["phone_number"]) && !empty($_POST["phone_number"])) {
        $phone_number = $_POST["phone_number"];

        $sql = "SELECT * FROM report WHERE phone_number = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $phone_number); 

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $reports = [];

            while ($row = $result->fetch_assoc()) {
                $reports[] = $row;
            }

            $response = ["reports" => $reports];
        } else {
            $response = ["error" => "Error: " . $stmt->error];
        }

        $stmt->close();

        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    } else {
        $response = ["error" => "Error: Missing phone_number"];
        header('Content-Type: application/json');
        echo json_encode($response);
        exit(); 
    }
}

$conn->close();
?>