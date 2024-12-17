import React, { useState } from 'react';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // ส่งข้อมูลไปยัง backend
    const data = {
      email,
      password,
      phoneNumber,
      nationalId,
      employeeId,
      firstName,
      lastName,
    };
    console.log('Data to submit:', data);
    // ที่นี่คุณควรจะส่งข้อมูล `data` ไปยัง backend ของคุณ
    // เช่น  fetch('/register', { method: 'POST', body: JSON.stringify(data) })
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>สมัครสมาชิก</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">อีเมล:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">เบอร์โทรศัพท์:</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nationalId">เลขบัตรประชาชน:</label>
            <input
              type="text"
              id="nationalId"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="employeeId">รหัสพนักงาน:</label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstName">ชื่อ:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">นามสกุล:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <button type="submit">สมัครสมาชิก</button>
        </form>
      </div>
    </div>
  );
}

export default Register;