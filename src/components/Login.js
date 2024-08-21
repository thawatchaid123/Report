import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      // ส่งข้อมูลไปยัง backend เพื่อยืนยันการเข้าสู่ระบบ
      const response = await fetch('/api/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // เข้าสู่ระบบสำเร็จ
        console.log('เข้าสู่ระบบสำเร็จ!');
        // รีไดเร็กไปยังหน้าหลักหรือหน้าอื่นๆ
      } else {
        // เข้าสู่ระบบไม่สำเร็จ
        const errorData = await response.json();
        setError(errorData.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }

    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      console.error("Error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>เข้าสู่ระบบ</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>ชื่อผู้ใช้:</label>
          <input 
            type="text" 
            id="username" 
            className={styles.input} 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>รหัสผ่าน:</label>
          <input 
            type="password" 
            id="password" 
            className={styles.input} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className={styles.button}>เข้าสู่ระบบ</button>
      </form>
    </div>
  );
};

export default Login;