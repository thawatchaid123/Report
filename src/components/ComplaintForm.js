import React, { useState } from 'react';
import axios from 'axios'; // เพิ่มบรรทัดนี้
import './ComplaintForm.css'; // เชื่อมต่อไฟล์ CSS

const ComplaintForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // ใช้ axios เพื่อส่งข้อมูลแบบ POST
    axios.post('/result.php', { phone_number: phoneNumber })
        .then(response => {
            // หลังจากส่งข้อมูลสำเร็จ เปลี่ยนเส้นทางไปยังหน้าผลลัพธ์
            window.location.href = `/project/ronren/result.php?phone_number=${phoneNumber}`; // ใช้ backticks เพื่อให้ ${phoneNumber} ทำงานได้
        })
        .catch(error => {
            console.error('Error submitting phone number:', error);
        });
  };

  return (
    <div className="form-container">
      <h2>กรอกเบอร์โทรศัพท์เพื่อติดตามเรื่องร้องเรียน</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone_number">เบอร์โทรศัพท์:</label>
        <input
          type="text"
          id="phone_number"
          name="phone_number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          maxLength="10"
          pattern="[0-9]{10}"
          required
        />
        <button type="submit">ค้นหา</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
