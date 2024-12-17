import React from 'react';
import './Technician.css';

function Technician() {
  return (
    <div className="Technician">
      <div className="block-container">
        <div className="block">
          <h2>เพิ่มข้อมูลเครื่องจักร</h2>
          <p>รายละเอียดเกี่ยวกับการเพิ่มข้อมูลเครื่องจักร</p>
          {/*  เพิ่มปุ่มหรือลิงก์ไปยังฟอร์มเพิ่มข้อมูลเครื่องจักรที่นี่  */}
          <button>ไปยังหน้าเพิ่มข้อมูล</button>
        </div>
        <div className="block">
          <h2>เพิ่ม/ลบ/แก้ไขข้อมูลส่วนตัว</h2>
          <p>รายละเอียดเกี่ยวกับการเพิ่ม ลบ และแก้ไขข้อมูลส่วนตัว</p>
          {/* เพิ่มปุ่มหรือลิงก์ไปยังฟอร์มแก้ไขข้อมูลส่วนตัวที่นี่ */}
          <button>ไปยังหน้าแก้ไขข้อมูล</button>
        </div>
        <div className="block">
          <h2>เช็คประวัติการแจ้งซ่อม</h2>
          <p>รายละเอียดเกี่ยวกับการตรวจสอบประวัติการแจ้งซ่อม</p>
          {/* เพิ่มปุ่มหรือลิงก์ไปยังหน้าเช็คประวัติการแจ้งซ่อมที่นี่ */}
          <button>ไปยังหน้าตรวจสอบประวัติ</button>
        </div>
      </div>
    </div>
  );
}

export default Technician;