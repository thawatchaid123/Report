import React from 'react';

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

export default Result;