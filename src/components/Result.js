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

const Result = ({ report }) => {
  return (
    <div>
      <h3>ผลการกรอกข้อมูล</h3>
      {report.map((report, index) => (
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
  const [report, setReport] = useState([]);

  const handleReportSubmit = (newReport) => {
    setReport([...report, newReport]);
  };

  return (
    <div className="app">
      <ComplaintForm />
      <Result report={report} />
    </div>
  );
}

export default App;