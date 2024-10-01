import React, { useState } from "react";
import axios from 'axios'; //  อย่าลืม import axios 
function ComplaintForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchResults, setSearchResults] = useState([]); //  เก็บผลลัพธ์การค้นหา

  
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

  const handleSubmit = async () => { 
    setErrorMessage(""); //  รีเซ็ต error message 

    if (!/^(08|09|06)\d{7}$/.test(phoneNumber)) {
      setErrorMessage("เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 08, 09 หรือ 06");
    } else {
      try {
        // ประกาศตัวแปร phone_number_without_0 ภายใน try block
      const phone_number_without_0 = phoneNumber.slice(1); 
        const response = await axios.post('https://thaiworkation.com/project/ronren/uploadd/search.php', {
          phone_number: phone_number_without_0 
        });

        if (response.data.error) {
          //  แสดง error message จาก Backend
          setErrorMessage(response.data.error); 
        } else {
          //  อัปเดต state searchResults ด้วยผลลัพธ์การค้นหา
          setSearchResults(response.data.reports); 
        }
      } catch (error) {
        console.error('Error searching reports:', error);
        setErrorMessage('เกิดข้อผิดพลาดในการค้นหาข้อมูล');
      }
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
       {/*  แสดงผลลัพธ์การค้นหา */}
    <Result searchResults={searchResults} /> 
    </div>
  );
}

const Result = ({ searchResults }) => { 
  return (
    <div>
      <h3>ผลการค้นหา:</h3>
      {searchResults.map((report, index) => (
        <div key={index}>
          <p>เบอร์โทรศัพท์: {report.phone_number}</p>
          <p>เรื่องที่แจ้ง: {report.report}</p>
          {/*  แสดงรูปภาพ */}
          {report.image_path && (
            <img 
              //  แก้ไข path ให้ถูกต้อง
              src={`/project/ronren/uploads/${report.image_path}`} 
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
  return (
    <div className="app">
      <ComplaintForm />
      {/*  ไม่ต้องใช้ Result ใน App component แล้ว */}
    </div>
  );
}

export default App;