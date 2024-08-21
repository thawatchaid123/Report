<?php

header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // เพิ่ม methods ที่อนุญาต
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // เพิ่ม headers ที่อนุญาต
error_log("PHP is executing");
// ตั้งค่าการแสดง Error
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Debugging
error_log("Debugging message: Upload started");
error_log("POST data: " . print_r($_POST, true));
error_log("FILES data: " . print_r($_FILES, true));

// กำหนด array ว่าง ไว้นอก loop
$uploaded_files = [];
$file_names = [];

// กำหนด path สำหรับ upload files
$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

if (isset($_FILES["photos"]) && !empty($_FILES["photos"]["tmp_name"])) {
    foreach ($_FILES["photos"]["tmp_name"] as $key => $tmp_name) {
        $file_name = basename($_FILES["photos"]["name"][$key]);
        $target_file = $target_dir . $file_name;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // ตรวจสอบว่าเป็นไฟล์รูปภาพ
        $check = getimagesize($tmp_name);
        if ($check === false) {
            echo json_encode(["error" => "File is not an image."]);
            exit;
        }

        // ตรวจสอบขนาดไฟล์ (สูงสุด 5MB)
        if ($_FILES["photos"]["size"][$key] > 5000000) { 
            echo json_encode(["error" => "Sorry, your file is too large."]);
            exit;
        }

        // ตรวจสอบชนิดไฟล์
        if (!in_array($imageFileType, ["jpg", "jpeg", "png", "gif"])) {
            echo json_encode(["error" => "Sorry, only JPG, JPEG, PNG & GIF files are allowed."]);
            exit;
        }

        // Upload ไฟล์
        error_log("Before uploading file");
        if (move_uploaded_file($tmp_name, $target_file)) {
            $uploaded_files[] = $target_file;
            $file_names[] = $file_name;
            error_log("After uploading file");
        } else {
            error_log("Error uploading file: " . $_FILES["photos"]["error"][$key]); 
        }        
    } // <--- ปีกกาปิด foreach 
} // <--- ปีกกาปิด if 

// บันทึก log เพื่อตรวจสอบการทำงาน (เรียกใช้เพียงครั้งเดียว)
file_put_contents('upload_log.txt', date('Y-m-d H:i:s') . ": Request received\n", FILE_APPEND);

// เชื่อมต่อฐานข้อมูล
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "reports";  // แก้ไขชื่อ database ให้ถูกต้อง

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// รับข้อมูลจาก POST request
$phone = $_POST['phone'] ?? '';
$issue = $_POST['issue'] ?? '';

// Debugging
error_log("Received POST data: " . print_r($_POST, true));
error_log("Received FILES data: " . print_r($_FILES, true));

// Insert data
foreach ($uploaded_files as $key => $uploaded_file) {
    $filename = $file_names[$key];
    $filepath = $uploaded_file; 
    $stmt = $conn->prepare("INSERT INTO reports (phone, issue, filename, filepath) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $phone, $issue, $filename, $filepath);
    if ($stmt->execute()) {
        echo json_encode(["success" => "New record created successfully"]); // ส่ง json response
    } else {
        echo json_encode(["error" => "Error: " . $stmt->error]); // ส่ง json error
    }
    $stmt->close(); 
}
?>