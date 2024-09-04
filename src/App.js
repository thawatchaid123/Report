import React, { useState, useEffect } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import Result from "./components/Result";
import ReportForm from './components/ReportForm';
import { Route, Routes } from 'react-router-dom';
import Login from "./components/Login"; 
import axios from 'axios';
import Footer from "./components/Footer";

function App() {
  const [report, setReport] = useState([]);

  // ดึงข้อมูลรายงานเมื่อ component โหลด
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get('https://thaiworkation.com/project/ronren/build/api/upload.php') ;
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };
    fetchReport();
  }, []);

  const handleReportSubmit = (newReport) => {
    // ส่งข้อมูลไปยัง Backend
    axios.post('https://thaiworkation.com/project/ronren/build/api/upload.php', newReport)
    .then(response => {
        console.log(response.data);
        // อัพเดท state ใน Frontend
        setReport([...report, newReport]); 
      })
      .catch(error => {
        console.error('Error submitting report:', error);
      });
  };

  return (
    <div className="app">
      <AppHeader />
      <section className="app-section">
        <div className="container">
          <h1>ยินดีต้อนรับสู่เว็บไซต์ร้องเรียน</h1>
          <p>ประชาชนทั่วไปหรือผู้ร้องทุกข์สามารถส่งเรื่องร้องเรียนมาได้ที่นี่</p>           
          
          <Routes>
            <Route path="/" element={<ReportForm onSubmit={handleReportSubmit} />} />
            <Route path="/result" element={<Result report={report} />} /> 
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default App;