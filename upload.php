<?php
// เชื่อมต่อฐานข้อมูล
$servername = "localhost";
$username = "arm2024"; // เปลี่ยน username และ password ให้ตรงกับการตั้งค่าของคุณ
$password = "0824012345A!!";
$dbname = "arm2024_ronren";

$conn = new mysqli($servername, $username, $password, $dbname);

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ตรวจสอบว่ามีการส่งข้อมูลมาหรือไม่
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // ตรวจสอบว่ามีการส่งข้อมูลที่จำเป็น
    if (isset($_POST["phone"], $_POST["issue"], $_POST["location_lat"], $_POST["location_lng"], $_FILES["photos"]) &&
        !empty($_POST["phone"]) && !empty($_POST["issue"])) {

        $phone = $_POST["phone"];
        $issue = $_POST["issue"];
        $locationLat = $_POST["location_lat"];
        $locationLng = $_POST["location_lng"];

        // อัพโหลดไฟล์
        $targetDir = "uploads/";
        $targetFile = $targetDir . basename($_FILES["photos"]["name"][0]);
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($targetFile,PATHINFO_EXTENSION));

        // ตรวจสอบว่าไฟล์เป็นรูปภาพ
        if (isset($_POST["submit"])) {
            $check = getimagesize($_FILES["photos"]["tmp_name"][0]);
            if($check !== false) {
                $uploadOk = 1;
            } else {
                echo "File is not an image.";
                $uploadOk = 0;
            }
        }

        // ตรวจสอบขนาดไฟล์
        if ($_FILES["photos"]["size"][0] > 500000) {
            echo "Sorry, your file is too large.";
            $uploadOk = 0;
        }

        // ตรวจสอบประเภทไฟล์
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
            echo "Sorry, only JPG, JPEG & PNG files are allowed.";
            $uploadOk = 0;
        }

        // อัพโหลดไฟล์ถ้าผ่านการตรวจสอบ
        if ($uploadOk == 1) {
            if (move_uploaded_file($_FILES["photos"]["tmp_name"][0], $targetFile)) {
                // ใช้ Prepared Statements เพื่อป้องกัน SQL Injection
                $stmt = $conn->prepare("INSERT INTO report (phone, issue, location_lat, location_lng, filename, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
                $stmt->bind_param("ssdds", $phone, $issue, $locationLat, $locationLng, basename($_FILES["photos"]["name"][0]));

                if ($stmt->execute() === TRUE) {
                    echo "New record created successfully";
                } else {
                    echo "Error: " . $stmt->error;
                }
                $stmt->close();
            } else {
                echo "Sorry, there was an error uploading your file.";
            }
        }
    } else {
        echo "Error: Missing required data.";
    }
}

$conn->close();
?>