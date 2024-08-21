// src/components/AppHeader.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./AppHeader.css";
import "./Style.css";

function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // ประกาศ state isMenuOpen

    const toggleMenu = () => { // ประกาศ function toggleMenu
      setIsMenuOpen(!isMenuOpen);
    };
    return (
        <header className="app-header">
            <div className="header-left">
                <img className="app-header-logo" src="/images/logo-project.png" alt="โลโก้ Godzilla" />
            </div>

            <nav className={`header-nav ${isMenuOpen ? 'show' : ''}`}> 
              
            <div className="header-center">
                <Link to="/">หน้าแรก</Link>
            </div>
            
        <ul>
          <li   className="header-right">
            <Link to="/result">ตรวจสอบ</Link>
          </li>
          <li  className="header-rights">
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      <button className="hamburger-button" onClick={toggleMenu}>
       
        {/* <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>  */}
        <i className="fa-solid fa-bars"></i>
      </button>
        </header>
    );
}

export default AppHeader;
