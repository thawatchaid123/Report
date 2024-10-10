<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ข้อมูลการร้องเรียน</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            background-color: #00a6ff; /* สีฟ้าอ่อน */
            color: #000; /* สีดำ */
        }
        
        .container {
            max-width: 960px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff; /* สีขาว */
            border-radius: 10px;
            box-shadow: 0px 0px 10px black(0, 0, 0, 0.1); /* เงา */
        }
        
        .header {
            text-align: center;
            padding: 20px 0;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin: 0;
        }
        
        nav {
            background-color: #007bff; /* สีฟ้าเข้ม */
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        
        nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        
        nav li {
            display: inline-block;
            margin: 0 10px;
        }
        
        nav a {
            color: #fff;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 5px;
            font-weight: bold;
        }
        
        nav a:hover {
            background-color: #0056b3; /* สีฟ้าเข้มขึ้น */
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-radius: 5px;
            overflow: hidden;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        
        th {
            background-color: #007bff; /* สีฟ้าเข้ม */
            color: #fff;
            font-weight: bold;
        }
        
        img {
            max-width: 100%; /* ปรับขนาดให้พอดีกับความกว้างของคอลัมน์ */
            height: auto;
            border-radius: 5px;
        }
        
        .footer {
            background-color: #007bff; /* สีฟ้าเข้ม */
            padding: 10px;
            text-align: center;
            margin-top: 20px;
            border-radius: 5px;
        }
        
        .footer p {
            margin: 0;
        }
        
        .footer a {
            color: #fff;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        .link-container {
            margin-top: 10px;
        }

        .link-container a {
            display: inline-block;
            padding: 8px 15px;
            background-color: #0056b3; /* สีฟ้าเข้ม */
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-right: 5px; /* ระยะห่างระหว่างลิงค์ */
        }

        .link-container a:hover {
            background-color: #004080; /* สีฟ้าเข้มขึ้น */
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>ข้อมูลการร้องเรียน</h1>
    </div>

    <nav>
        <ul>
            <li><a href="index.php">หน้าแรก</a></li>
            <!-- <li><a href="complaintForm.php">ตรวจสอบ</a></li>  -->
        </ul>
    </nav>

    <?php
    // การตั้งค่าการเชื่อมต่อฐานข้อมูล
    $servername = "localhost";
    $username = "arm2024_ronren";
    $password = "123456789";
    $dbname = "arm2024_ronren";

    // สร้างการเชื่อมต่อฐานข้อมูล
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset("utf8mb4");

    if ($conn->connect_error) {
        die("การเชื่อมต่อล้มเหลว: " . $conn->connect_error);
    }

    if (isset($_GET['phone_number']) && !empty($_GET['phone_number'])) {
        $phone_number = $_GET['phone_number'];

        $stmt = $conn->prepare("SELECT phone_number, report, image_path FROM report WHERE phone_number = ?");
        $stmt->bind_param("s", $phone_number);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo "<table>";
            echo "<tr><th>ข้อมูลสำหรับเบอร์โทรศัพท์</th><th>รูปภาพ</th></tr>";

            while ($row = $result->fetch_assoc()) {
                echo "<tr><td>";
                echo "<strong>เบอร์โทรศัพท์:</strong> " . htmlspecialchars($row['phone_number']) . "<br>";
                echo "<strong>รายงาน:</strong> " . htmlspecialchars($row['report']) . "<br>";
                echo "</td><td>";

                if (!empty($row['image_path'])) {
                    $imagePaths = explode(',', $row['image_path']);
                    if (!empty($imagePaths)) {
                        echo '<div class="link-container">';
                        foreach ($imagePaths as $imagePath) {
                            echo '<a href="' . $imagePath . '" target="_blank"><img src="' . $imagePath . '" alt="รูปภาพ" width="150"></a>';
                        }
                        echo '</div>';
                    }
                } else {
                    echo "<p>ไม่มีรูปภาพ</p>";
                }

                echo "</td></tr>";
            }
            echo "</table>";
        } else {
            echo "<p>ไม่พบข้อมูลสำหรับเบอร์โทรศัพท์นี้</p>";
        }

        $stmt->close();
    } else {
        echo "<p>กรุณากรอกเบอร์โทรศัพท์</p>";
    }

    $conn->close();
    ?>

    <div class="footer">
        <p>© 2024 Naruthee Consulting</p>
        <p><a href="#">ติดต่อเรา</a> | <a href="#">นโยบายความเป็นส่วนตัว</a></p>
    </div>
</div>

</body>
</html>