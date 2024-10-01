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
// เพิ่มบรรทัดนี้  เพื่อตั้งค่า Character Set เป็น utf8mb4
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["phone"], $_POST["issue"], $_FILES["photos"]) &&
        !empty($_POST["phone"]) && !empty($_POST["issue"])) {

        $phone = $_POST["phone"];
        $issue = $_POST["issue"];

        // อัพโหลดไฟล์
        $targetDir = "uploads/";
        $uploadedFileNames = []; 

        for ($i = 0; $i < count($_FILES["photos"]["name"]); $i++) {
            $targetFile = $targetDir . basename($_FILES["photos"]["name"][$i]);
            $uploadOk = 1;
            $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

            // ตรวจสอบว่าไฟล์เป็นรูปภาพ
            $check = getimagesize($_FILES["photos"]["tmp_name"][$i]);
            if($check !== false) {
                $uploadOk = 1;
            } else {
                $uploadOk = 0;
                $response = array("error" => "File is not an image.");
                header('Content-Type: application/json');
                echo json_encode($response);
                exit();
            }

            // ตรวจสอบขนาดไฟล์
            if ($_FILES["photos"]["size"][$i] > 500000) {
                $uploadOk = 0;
                $response = array("error" => "Sorry, your file is too large.");
                header('Content-Type: application/json');
                echo json_encode($response);
                exit();
            }

            // ตรวจสอบประเภทไฟล์
            if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
                $uploadOk = 0;
                $response = array("error" => "Sorry, only JPG, JPEG & PNG files are allowed.");
                header('Content-Type: application/json');
                echo json_encode($response);
                exit();
            }

            if ($uploadOk == 1) {
                if (move_uploaded_file($_FILES["photos"]["tmp_name"][$i], $targetFile)) {
                    $uploadedFileNames[] = basename($_FILES["photos"]["name"][$i]); 
                } else {
                    $response = array("error" => "Sorry, there was an error uploading your file.");
                    header('Content-Type: application/json');
                    echo json_encode($response);
                    exit(); 
                }
            } 
        } 

        // บันทึกข้อมูลลงฐานข้อมูล
        if (!empty($uploadedFileNames)) {
            $filenames = implode(",", $uploadedFileNames); 
            $stmt = $conn->prepare("INSERT INTO report (phone_number, report) VALUES (?, ?)"); 
            $stmt->bind_param("ss", $phone, $issue); 

            if ($stmt->execute()) {
                $response = array("message" => "New record created successfully");
            } else {
                $response = array("error" => "Error: " . $stmt->error);
            }
            $stmt->close();

            header('Content-Type: application/json');
            echo json_encode($response);
            exit();
        }
    } else {
        $response = array("error" => "Error: Missing required data.");
        header('Content-Type: application/json');
        echo json_encode($response);
        exit(); 
    }
}

$conn->close();
?>