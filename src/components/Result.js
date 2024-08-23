import React, { useState } from "react";

function ComplaintForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    let inputValue = event.target.value;

    // ตรวจสอบว่าเป็นตัวเลข และ ตัดให้เหลือไม่เกิน 10 ตัว
    inputValue = inputValue.replace(/[^0-9]/g, '').slice(0, 10);
    
    // ตรวจสอบว่าตัวแรกเป็น 0 หรือไม่ ถ้าไม่ใช่ให้ return
    if (inputValue.length === 1 && inputValue !== '0') {
      setErrorMessage("เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0");
      return; 
    }

    setPhoneNumber(inputValue);

    // ตรวจสอบ error message ทีหลังจาก set ค่าแล้ว
    if (inputValue.length === 10 && !/^(08|09|06)\d{7}$/.test(inputValue)) { 
      setErrorMessage("เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 08, 09 หรือ 06");
    } else if (inputValue.length !== 10 && inputValue.length > 0) {
      setErrorMessage("เบอร์โทรศัพท์ต้องมี 10 ตัว");
    } else {
      setErrorMessage(""); 
    }
  };

  const handleSubmit = () => {
    setErrorMessage(""); // รีเซ็ต error message ก่อน

    if (!/^(08|09|06)\d{7}$/.test(phoneNumber)) {
      setErrorMessage("เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 08, 09 หรือ 06");
    } else {
      console.log("เบอร์โทรศัพท์ที่กรอก:", phoneNumber);
    }
  };
  return (
    <div className="complaint-form-container">
      <h2 className="complaint-form-title">ติดตามเรื่องร้องเรียน</h2>
      <p className="complaint-form-description">
       
      </p>
      <div className="input-container">
        <label htmlFor="phoneNumber" className="input-label">
          เบอร์โทรศัพท์:
        </label>
        <input
          type="tel"
          id="phoneNumber"
          className="large-inputs"
          value={phoneNumber}
          onChange={handleChange}
          placeholder="กรุณากรอกเบอร์โทรศัพท์"
        />
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* แสดง error message */}
      </div>
      <button onClick={handleSubmit} className="submit-button">
        ยืนยัน
      </button> 
    </div>
  );
}

const Result = ({ reports }) => {
  return (
    <div>
      <h3>ผลการกรอกข้อมูล</h3>
      {reports.map((report, index) => (
        <div key={index}>
          <p>เบอร์โทรศัพท์: {report.phone}</p>
          <p>เรื่องที่แจ้ง: {report.issue}</p>
          {/* แสดงรูปภาพ */}
          {report.filename && (
            <img
              src={`http://localhost/PO/uploads/${report.filename}`}
              alt={`Report ${index + 1}`}
              style={{ maxWidth: '300px', height: 'auto' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

function App() {
  const [reports, setReports] = useState([]);

  const handleReportSubmit = (newReport) => {
    setReports([...reports, newReport]);
  };

  return (
    <div className="app">
      <ComplaintForm />
      <Result reports={reports} />
    </div>
  );
}

export default App;

// const validateTel = (tel) => {
//   // เพิ่มลอจิกการตรวจสอบหมายเลขโทรศัพท์
//   return tel.length === 10; // ตัวอย่างการตรวจสอบ
// };

// const handleTelChange = (e) => {
//   const inputValue = e.target.value;
//   const numericInput = inputValue.replace(/[^0-9]/g, ''); // ลบตัวอักษรออก

//   // ตรวจสอบเลขตัวแรก
//   if (numericInput.length === 1 && numericInput !== "0") {
//       // ถ้าเลขตัวแรกไม่ใช่ 0 ให้ setTel เป็นค่าเดิม (ไม่ให้พิมพ์)
//       setTel(tel);
//       return; // หยุดการทำงานของฟังก์ชัน 
//   }

//   // ตรวจสอบเลขสองตัวแรก
//   if (numericInput.length >= 2) {
//       const firstTwoDigits = numericInput.substring(0, 2);
//       if (!["08", "09", "02", "06"].includes(firstTwoDigits)) {
//           // ถ้าเลขสองตัวแรกไม่ถูกต้อง แสดงข้อความเตือน
//           alert("กรุณากรอกเลขสองตัวแรกเป็น 08, 09, 02, หรือ 06");
//           setTel(tel); // ตั้งค่า tel เป็นค่าเดิม (ไม่ให้พิมพ์)
//           return; // หยุดการทำงานของฟังก์ชัน 
//       }
//   }

//   if (validateTel(numericInput)) {
//       // ถ้า input มี 10 ตัวแล้ว ให้ setTel เป็นค่า input
//       setTel(numericInput);
//   } else if (numericInput.length < 10) {
//       // ถ้า input น้อยกว่า 10 ตัว ให้ setTel เป็นค่า input
//       setTel(numericInput);
//   } else {
//       // ถ้า input เกิน 10 ตัว ให้ setTel เป็นค่าเดิม
//       // ไม่ให้พิมพ์เพิ่ม
//       setTel(tel);
//   }
// };