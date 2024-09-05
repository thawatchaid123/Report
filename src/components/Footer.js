import React from 'react';
import '../components/Footer.css';

const Footer = () => {
  return (
    <div className="copy">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="copyright-section">
              <img src="/project/ronren/build/images/ronren.png" alt="Copyright Icon" />
              <p className="copyright-text">เเจ้งเหตุ | สงวนลิขสิทธิ์</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center p-4">
            <p>Naruthee Consulting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;