<?php
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

// ตรวจสอบการเชื่อมต่อฐานข้อมูล
if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}

// ตรวจสอบว่าเป็น POST request หรือไม่
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['phone_number']) && !empty($_POST['phone_number'])) {
        $phone_number = $_POST['phone_number'];
        $sql = "SELECT * FROM report WHERE phone_number = ?";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            error_log("Prepare failed: " . $conn->error);
            $response = ['error' => 'เกิดข้อผิดพลาดในการเตรียมคำสั่ง SQL'];
            header('Content-Type: application/json');
            echo json_encode($response);
            exit();
        }

        $stmt->bind_param("s", $phone_number);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $reports = [];

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $imagePaths = explode(',', $row['image_path']);
                    $reports[] = [
                        'phone_number' => $row['phone_number'],
                        'report' => $row['report'],
                        'image_path' => $imagePaths // ส่ง array ของ image_path
                    ];
                }

                $response = ["reports" => $reports];
                header('Content-Type: application/json');
                echo json_encode($response);
                exit();
            } else {
                // ส่งข้อมูลเมื่อไม่พบข้อมูล
                $response = ['error' => 'ไม่พบข้อมูล'];
                header('Content-Type: application/json');
                echo json_encode($response);
                exit();
            }
        } else {
            error_log("Execute failed: " . $stmt->error);
            $response = ['error' => 'เกิดข้อผิดพลาดในการค้นหาข้อมูล'];
            header('Content-Type: application/json');
            echo json_encode($response);
            exit();
        }

        $stmt->close();
    } else {
        $response = ['error' => 'เบอร์โทรศัพท์ไม่ถูกต้อง'];
        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    }
}

$conn->close();
?>