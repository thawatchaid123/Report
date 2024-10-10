import React, { useState } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import Result from "./components/Result";
import ReportForm from './components/ReportForm';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from "./components/Login"; 
import axios from 'axios';
import Footer from "./components/Footer";
import ComplaintForm from './components/ComplaintForm';
import ComplaintForms from './components/ComplaintForms'; // นำเข้า component

function App() {
  const [report, setReport] = useState([]);
  const [searchResults, setSearchResults] = useState([]); 
  const navigate = useNavigate(); // ประกาศตัวแปร navigate

  const handleReportSubmit = (newReport) => {
    // ส่งข้อมูลไปยัง Backend
    axios.post('https://thaiworkation.com/uploadd.php', newReport)
      .then(response => {
        console.log("Server response:", response.data); 
        if (response.data.message) {
          console.log("Message:", response.data.message); 
        }
        if (response.data.error) {
          console.error("Error:", response.data.error); 
        }
        // อัพเดท state report ด้วยข้อมูลที่ได้รับจาก uploadd.php
        setReport([...report, newReport]); 
        // ส่งข้อมูลไปยัง ComplaintForm
        setSearchResults(response.data); // แก้ไขการส่งข้อมูลให้ใช้ state แทน search
        navigate('/complaintform'); // นำทางผู้ใช้ไปที่หน้า Result
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
            <Route path="/complaintform" element={<ComplaintForm searchResults={searchResults} />} /> 
            <Route path="/result" element={<Result searchResults={searchResults} />} />
            <Route path="/complaint-form" element={<ComplaintForms />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default App;