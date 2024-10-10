<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// สร้างการเชื่อมต่อฐานข้อมูล
$mysqli = new mysqli("localhost", "arm2024_ronren", "123456789", "arm2024_ronren");

// ตรวจสอบการเชื่อมต่อ
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// ตั้งค่าการเชื่อมต่อให้ใช้ UTF-8
$mysqli->set_charset("utf8mb4");

// ตรวจสอบว่าเป็น POST request หรือไม่
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["phone"], $_POST["issue"], $_FILES["photos"]) &&
!empty($_POST["phone"]) && !empty($_POST["issue"])) {

        $phone = $_POST["phone"];
        $issue = $_POST["issue"];
        $imagePaths = []; // เก็บเส้นทางของรูปภาพ

        // อัปโหลดรูปภาพ
        $targetDir = "uploads/"; 
        foreach ($_FILES['photos']['tmp_name'] as $key => $tmp_name) {
            $fileName = $_FILES['photos']['name'][$key];
            $targetFile = $targetDir . basename($fileName);
            $uploadOk = 1;
            $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

            // ตรวจสอบว่าไฟล์เป็นรูปภาพ
            $check = getimagesize($tmp_name);
            if ($check === false) {
                echo json_encode(['error' => 'File is not an image']);
                exit;
            }

            // ตรวจสอบขนาดไฟล์
            if ($_FILES["photos"]["size"][$key] > 500000) {
                echo json_encode(['error' => 'Sorry, your file is too large.']);
                exit;
            }

            // ตรวจสอบประเภทไฟล์
            if (!in_array($imageFileType, ['jpg', 'jpeg', 'png'])) {
                echo json_encode(['error' => 'Sorry, only JPG, JPEG & PNG files are allowed.']);
                exit;
            }

            // อัปโหลดไฟล์
            if (move_uploaded_file($tmp_name, $targetFile)) {
                $imagePaths[] = $targetFile; // เก็บ path ของรูปภาพ
            } else {
                echo json_encode(['error' => 'Failed to upload image']);
                exit;
            }
        }

        // บันทึกข้อมูลลงในฐานข้อมูล
        if (!empty($imagePaths)) {
            $imagePathStr = implode(',', $imagePaths); // แปลง array เป็น string
            $stmt = $mysqli->prepare("INSERT INTO report (phone_number, report, image_path) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $phone, $issue, $imagePathStr);

            if ($stmt->execute()) {
                echo json_encode(['success' => 'Data saved successfully']);
            } else {
                echo json_encode(['error' => 'Failed to save data: ' . $stmt->error]);
            }
        } else {
            echo json_encode(['error' => 'No images uploaded.']);
        }

        // ปิด statement
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Missing required fields.']);
    }
}

// ปิดการเชื่อมต่อ
$mysqli->close();
?>