import React, { useState } from 'react';
import axios from 'axios';
import './ComplaintForm.css';

const ComplaintForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/result.php', { phone_number: phoneNumber })
        .then(response => {
            window.location.href = `components/result.php?phone_number=${phoneNumber}`;
        })
        .catch(error => {
            console.error('Error submitting phone number:', error);
        });
  };

  return (
    <div className="form-container">
      <h2>ติดตามสถานะ</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone_number">รหัสพนักงาน:</label>
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