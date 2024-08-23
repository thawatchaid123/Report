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
  const [reports, setReports] = useState([]);

  // ดึงข้อมูลรายงานเมื่อ component โหลด
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, []);

  const handleReportSubmit = (newReport) => {
    // ส่งข้อมูลไปยัง Backend
    axios.post('http://localhost:5000/api/reports', newReport)
      .then(response => {
        console.log(response.data);
        // อัพเดท state ใน Frontend
        setReports([...reports, newReport]); 
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
            <Route path="/result" element={<Result reports={reports} />} /> 
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default App;