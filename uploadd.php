<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "reportss";

$mysqli = new mysqli($servername, $username, $password, $dbname);
$mysqli->set_charset("utf8mb4");

if ($mysqli->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $mysqli->connect_error]));
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["phone"], $_POST["issue"], $_POST["category"]) && 
        !empty($_POST["phone"]) && !empty($_POST["issue"])) {

        $phone = $mysqli->real_escape_string($_POST["phone"]); // ป้องกัน SQL injection
        $issue = $mysqli->real_escape_string($_POST["issue"]); // ป้องกัน SQL injection
        $category = $mysqli->real_escape_string($_POST["category"]); // ป้องกัน SQL injection
        $imagePaths = [];

        $targetDir = "uploads/"; // ตรวจสอบว่าโฟลเดอร์นี้มีอยู่และสามารถเขียนได้
        if (!is_dir($targetDir)) { mkdir($targetDir, 0777, true); } // สร้างโฟลเดอร์ถ้าไม่มี

        if (!empty($_FILES['photos']['name'])) { // ตรวจสอบว่ามีไฟล์อัปโหลด
            foreach ($_FILES['photos']['tmp_name'] as $key => $tmp_name) {
                $originalFileName = $_FILES['photos']['name'][$key];
                $fileName = uniqid() . "_" . $originalFileName; // เปลี่ยนชื่อไฟล์เพื่อป้องกันการเขียนทับ
                $targetFile = $targetDir . $fileName;
                $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

                if(isset($_POST["submit"]) && $_POST["submit"] === "submit") { // เพิ่มการตรวจสอบเพื่อให้แน่ใจว่าฟอร์มถูกส่งมาจากเว็บไซต์
                if ($check = getimagesize($tmp_name)) { // ตรวจสอบว่าเป็นไฟล์รูปภาพ
                    if ($_FILES["photos"]["size"][$key] < 5000000) { // ขนาดไฟล์ไม่เกิน 5 MB
                        if (in_array($imageFileType, ['jpg', 'jpeg', 'png', 'gif'])) { // ประเภทไฟล์ถูกต้อง
                            if (move_uploaded_file($tmp_name, $targetFile)) {
                                $imagePaths[] = $targetFile;
                            } else {
                                die(json_encode(['error' => 'Failed to upload image']));
                            }
                        } else {
                            die(json_encode(['error' => 'Sorry, only JPG, JPEG, PNG & GIF files are allowed.']));
                        }
                    } else {
                        die(json_encode(['error' => 'Sorry, your file is too large.']));
                    }
                } else {
                    die(json_encode(['error' => 'File is not an image']));
                }
                }
            }
        }


        $imagePathStr = implode(',', $imagePaths);

        $stmt = $mysqli->prepare("INSERT INTO reports (phone_number, reports, image_path, category) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $phone, $issue, $imagePathStr, $category);

        if ($stmt->execute()) {
            echo json_encode(['success' => 'Data saved successfully', 'id' => $mysqli->insert_id]); // ส่ง id กลับไปด้วย
        } else {
            echo json_encode(['error' => 'Failed to save data: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Missing required fields.']);
    }
}
$mysqli->close();
?>