
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Fuse from 'fuse.js';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useState, useRef } from 'react';

const ReportForm = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');
  const [issue, setIssue] = useState('');
  const [photos, setPhotos] = useState([]);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [showSubOptions, setShowSubOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const issueRef = useRef(null); 
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    if (e.target.files.length > 0) {
      setPhotos([...e.target.files]);
      setHasPhoto(true);
    } else {
      setPhotos([]);
      setHasPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('issue', issue);
    for (let i = 0; i < photos.length; i++) {
      formData.append('photos[]', photos[i]);
    }
    // axios.post('/PO/upload.php', formData,  {
    axios.post('/upload.php', formData,  {
      withCredentials: false,  // เปลี่ยนเป็น false
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('Success:', response.data);
      // จัดการกับ response ที่นี่
    })
    .catch(error => {
      console.error('Error:', error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    });
    try {
      const response = await axios.post('/upload.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server response:', response.data);
      if (response.data.error) {
        console.error('Server error:', response.data.error);
      } else {
        onSubmit(response.data);
        // รีเซ็ตฟอร์ม
        setPhone('');
        setIssue('');
        setPhotos([]);
        setHasPhoto(false);
        // ไปยังหน้า Result
        navigate('/result'); 
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handlePhoneChange = (e) => {
    const inputPhone = e.target.value;
    const numericPhone = inputPhone.replace(/[^0-9]/g, '');

    if (numericPhone.length > 10) {
      setPhoneError('กรุณากรอกเบอร์โทรศัพท์ไม่เกิน 10 หลัก');
    } else if (numericPhone.length === 10 && !/^0(6|8|9)\d{8}$/.test(numericPhone)) {
      setPhoneError('กรุณากรอกเบอร์โทรศัพท์ที่ขึ้นต้นด้วย 06 หรือ 08 หรือ 09');
    } else {
      setPhoneError(null);
    }

    setPhone(numericPhone);
  };
   
  const categories = [
    {
      name: "สำนักงานตำรวจแห่งชาติ",
      subOptions: ["ตัวอย่าง1", "ตัวอย่าง2", "ตัวอย่าง3"],
    },
    {
      name: "เหตุฉุกเฉินทางการแพทย์",
      subOptions: ["ตัวอย่าง4", "ตัวอย่าง5", "ตัวอย่าง6"],
    },
    {
      name: "บริการสาธารณะ",
      subOptions: ["ตัวอย่าง7", "ตัวอย่าง8", "ตัวอย่าง9"],
    },
    {
      name: "สิ่งแวดล้อม",
      subOptions: [
        "ปัญหาขยะและการจัดการขยะ : หน่วยงานที่รับผิดชอบ: องค์การบริหารส่วนท้องถิ่น (อบต. หรือ เทศบาล)",
        "มลพิษทางอากาศ : กรมควบคุมมลพิษ หรือ องค์การบริหารส่วนท้องถิ่น",
        "การทิ้งน้ำเสียและการปนเปื้อนของแหล่งน้ำ : กรมควบคุมมลพิษ หรือกรมทรัพยากรน้ำ",
      ],
    },
    {
      name: "ความปลอดภัยทางถนน",
      subOptions: ["ตัวอย่าง10", "ตัวอย่าง11", "ตัวอย่าง12"],
    },
    {
      name: "การบริการสุขภาพ",
      subOptions: ["ตัวอย่าง13", "ตัวอย่าง14", "ตัวอย่าง15"],
    },
    {
      name: "บริการการศึกษา",
      subOptions: ["ตัวอย่าง16", "ตัวอย่าง17", "ตัวอย่าง18", "ตัวอย่าง19"],
    },
    {
      name: "สิทธิแรงงาน",
      subOptions: ["ตัวอย่าง20", "ตัวอย่าง21", "ตัวอย่าง22"],
    },
    {
      name: "การคมนาคมเเละเดินทาง",
      subOptions: ["ตัวอย่าง23", "ตัวอย่าง24", "ตัวอย่าง25"],
    },
     {
      name: "ปัญหาทางกฎหมาย",
      subOptions: ["การถูกโกง", "การคุกคาม", "ปัญหาสัญญา"],
    },
  ];
  // สร้าง Fuse.js index สำหรับ categories และ subOptions
  const fuseOptions = {
    keys: ['name', 'subOptions'],
    threshold: 0.4,
  };
  const fuseIndex = Fuse.createIndex(fuseOptions.keys, categories);
  const fuse = new Fuse(categories, fuseOptions, fuseIndex);

  const handleIssueChange = (e) => {
    const inputText = e.target.value;
    setIssue(inputText);

    if (inputText.length >= 2) {  // ตรวจสอบความยาวของข้อความ
      // แยกคำค้นหา
      const searchTerms = inputText.trim().split(/\s+/);

      // ค้นหาคำที่ใกล้เคียงสำหรับแต่ละคำ
      const searchResults = searchTerms.map(term => fuse.search(term)); 

      // หา intersection ของผลลัพธ์
      const results = searchResults.reduce((a, b) => 
        a.filter(itemA => b.some(itemB => itemA.item.name === itemB.item.name))
      );

      // แสดงผลลัพธ์
      if (results.length > 0) {
        setShowSubOptions(true);
        setSelectedCategory({
          name: 'ผลลัพธ์การค้นหา',
          subOptions: results.map((result) => result.item.name),
        });
      } else {
        setShowSubOptions(false);
        setSelectedCategory(null);
      }
    } else if (inputText.length === 0) {
      // รีเซ็ตผลลัพธ์เมื่อลบข้อความทั้งหมด
      setShowSubOptions(false);
      setSelectedCategory(null);
    } 
  };
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowSubOptions(true);
  };

  const handleSubOptionClick = (subOption) => {
    setIssue(`${selectedCategory.name} - ${subOption}`);
    setShowSubOptions(false);
  };
  const [markerPosition, setMarkerPosition] = useState({ 
    lat: 13.7563, // latitude เริ่มต้น
    lng: 100.5018  // longitude เริ่มต้น
  });
  const handleMarkerDragEnd = (e) => {
    setMarkerPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="tom">
        <label>เรื่องที่แจ้ง</label>
        <div className="blocks-container">
          {!showSubOptions &&
            categories.map((category) => (
              <Block
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                text={category.name}
              />
            ))}
          {showSubOptions && (
            <div>
              {selectedCategory.subOptions.map((subOption) => (
                <Block
                  key={subOption}
                  onClick={() => handleSubOptionClick(subOption)}
                  text={subOption}
                />
              ))}
            </div>
          )}
        </div>


        <div className="input-with-attachment">
          <textarea
            ref={issueRef}  // ใช้ issueRef ที่นี่
            value={issue}
            onChange={handleIssueChange} 
            required
            className="large-input"
            rows="3"
            placeholder="พิมพ์ข้อความและแนบรูปภาพ"
          />
          <label
            className="file-attachment-label"
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <i className="fas fa-upload"></i>
            <input
              type="file"
              onChange={handlePhotoChange}
              className="file-input"
              multiple
              style={{ display: "none" }} // ซ่อน input file
            />
            {hasPhoto && <i className="fas fa-check photo-attached-icon"></i>}
          </label>
        </div>
      </div>

      <div className='tom'>
        <label>สถานที่</label>
        <LoadScript googleMapsApiKey="AIzaSyAka-ib6oCwDyXOKpbVUR6vUFo6EXQk6Rg">
          <GoogleMap
            mapContainerStyle={{ height: "400px", width: "100%" }}
            center={markerPosition} 
            zoom={8}
          >
            <Marker 
              position={markerPosition} 
              draggable={true}
              onDragEnd={handleMarkerDragEnd} 
            />
          </GoogleMap>
        </LoadScript>
      </div>






      <div className="button-container">
        <div className="tom1">
          <label>เบอร์โทรศัพท์</label>
          <input
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            required
            className="large-inputs"
          />
          {phoneError && <div className="error">{phoneError}</div>}
          <button type="submit" className="submit-button">
            ยืนยัน
          </button>
        </div>
      </div>
    </form>
  );
};
function Block({ onClick, text }) {
  return (
    <div className="block" onClick={onClick}>
      {text}
    </div>
  );
}

export default ReportForm;
