import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Fuse from "fuse.js";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useState, useRef } from "react";
import Map from "./Map";

const ReportForm = ({ onSubmit }) => {
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState("");
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
    formData.append("phone", phone);
    formData.append("issue", issue);


    
    for (let i = 0; i < photos.length; i++) {
      formData.append("photos[]", photos[i]);
    }

    try {
      const response = await axios.post('/project/ronren/uploadd.php',formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Server response:", response.data);
      if (response.data.error) {
        console.error("Server error:", response.data.error);
      } else {
        onSubmit(response.data);
        // รีเซ็ตฟอร์ม
        setPhone("");
        setIssue("");
        setPhotos([]);
        setHasPhoto(false);
        // ไปยังหน้า Result
        navigate("/result");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handlePhoneChange = (e) => {
    const inputPhone = e.target.value;
    const numericPhone = inputPhone.replace(/[^0-9]/g, "");

    // ตรวจสอบว่าตัวแรกเป็น 0 หรือไม่
    if (numericPhone.length === 1 && numericPhone !== "0") {
      setPhoneError("เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0");
      return; // หยุดการทำงานหากไม่ใช่ 0
    }

    if (numericPhone.length > 10) {
      setPhoneError("กรุณากรอกเบอร์โทรศัพท์ไม่เกิน 10 หลัก");
    } else if (
      numericPhone.length === 10 &&
      !/^0(6|8|9)\d{8}$/.test(numericPhone)
    ) {
      setPhoneError("กรุณากรอกเบอร์โทรศัพท์ที่ขึ้นต้นด้วย 06 หรือ 08 หรือ 09");
    } else {
      setPhoneError(null);
    }

    setPhone(numericPhone);
  };
  const categories = [
    {
      name: "ตำรวจ",
      subOptions: [
        "ถูกข่มขู่คุกคาม",
        "ถูกหมิ่นประมาท",
        "ถูกทำร้ายร่างกาย",
        "ถูกขโมยทรัพย์สิน",
        "ปัญหาเสียงดังรบกวน",
        "มั่วสุมดื่มสุราในที่สาธารณะ",
        "พรากผู้เยาว์",
        "ขายบริการ",
      ],
    },
    {
      name: "ไฟฟ้า",
      subOptions: [
        "ไฟดับ",
        "ไฟฟ้าตก",
        "สายไฟพันกัน",
        "สายไฟฟ้าขาด/ชำรุด/ร่วงหล่นพันกัน",
        "อุปกรณ์ไฟฟ้าชำรุด",
        "ต้นไม้/สิ่งปลูกสร้าง ล้ำแนวสายไฟ",
      ],
    },
    {
      name: "สิ่งแวดล้อม",
      subOptions: [
        "ปัญหาขยะและการจัดการขยะ : หน่วยงานที่รับผิดชอบ: องค์การบริหารส่วนท้องถิ่น (อบต. หรือ เทศบาล)  ผักตบสวา",
        "มลพิษทางอากาศ : กรมควบคุมมลพิษ หรือ องค์การบริหารส่วนท้องถิ่น",
        "การทิ้งน้ำเสียและการปนเปื้อนของแหล่งน้ำ : กรมควบคุมมลพิษ หรือกรมทรัพยากรน้ำ",
        "โรงงานอุตสาหกรรม ปล่อยสิ่งปฏิกูลลงในเเม่น้ำ",
        "เผาขยะ",
      ],
    },
    {
      name: "เส้นทางถนน",
      subOptions: [
        "ถนนเป็นหลุมบ่อ",
        " แจ้งคนขับรถผิดกม.",
        "ถนนมีน้ำขัง",
        "ต้นไม้ล้มขวางทางสัญจร",
      ],
    },
    {
      name: "สุขภาพ",
      subOptions: [
        "รอคิวนาน",
        "การบริการไม่สุขภาพ",
        "วินิจฉัยโรคผิดพลาด",
        "ปฏิเสธไม่รับคนไข้ฉุกเฉิน โดยไม่มีเหตุผลอันควร",
        "บอกให้ไปรักษาที่อื่น ทั้งที่อยู่ในเขตรับผิดชอบ",
        "รอพบแพทย์หรือนัดผ่าตัดนานเกินสมเหตุผล*ไม่ได้รับความช่วยเหลืออย่างทันท่วงที ทั้งที่มีอาการหนัก",
        "ถูกเลื่อนนัดโดยไม่มีการแจ้งล่วงหน้า",
      ],
    },
    {
      name: "การศึกษา",
      subOptions: [
        "การทำโทษนักเรียนรุนเเรงเกินไป",
        "บุคลากรทำตัวไม่เหมาะสม",
        "มีการฉ้อโกงภายในระบบการศึกษา",
      ],
    },
    {
      name: "แรงงาน",
      subOptions: [
        "นายจ้างไม่ทำตามสัญญาจ้าง",
        "นายจ้างหักค่าจ้างโดยไม่เป็นธรรม",
        "นายจ้างไม่จัดให้มีสภาพแวดล้อมในการทำงานที่ปลอดภัย",
      ],
    },
    {
      name: "การเดินทาง",
      subOptions: [
        "เรียกแท็กซีไม่จอดเเละไม่ยอมกดมิเตอร์",
        "พนักงานขับรถไม่สุขภาพ",
        "รถประจำทางมาช้ากว่ากำหนด",
        "พนักงานบริการไม่สุขภาพ",
      ],
    },
    {
      name: "กฎหมาย",
      subOptions: [
        "การถูกโกง",
        "การคุกคาม",
        "ปัญหาทางสัญญา  ",
        "ปัญหาเกี่ยวกับทรัพย์สิน",
        "ปัญหาครอบครัว",
        "ปัญหาผู้บริโภค",
        "ปัญหาอาญา",
      ],
    },
    {
      name: "สินค้าและบริการ",
      subOptions: [
        "สินค้าหมดอายุ",
        "สินค้าปลอม",
        "การขายสินค้าเกินราคาจริง",
        "ยาและอาหารไม่มี (อย.)",
      ],
    },
    {
      name: "ขอความช่วยเหลือ",
      subOptions: ["หลงทาง", "รถเสีย", "สัตว์เลี้ยงหาย  เเมว หมา ", "ของหาย"],
    },
    {
      name: "สารเสพติด",
      subOptions: [
        "เจอสารเสพติด",
        "การซื้อขาย ลำเลียง ผลิต หรือครอบครองยาเสพติดทุกชนิด",
        "พฤติกรรมน่าสงสัยที่เชื่อว่าเกี่ยวข้องกับยาเสพติด ",
        "ข้อมูลเกี่ยวกับบุคคลที่เกี่ยวข้องกับยาเสพติด เช่น ผู้ค้า ผู้เสพ ผู้ผลิต",
        "เว็บไซต์ หรือช่องทางออนไลน์ที่ขายยาเสพติด",
      ],
    },
  ];
  // สร้าง Fuse.js index สำหรับ categories และ subOptions
  const fuseOptions = {
    keys: ["name", "subOptions"],
    threshold: 0.4,
  };
  const fuseIndex = Fuse.createIndex(fuseOptions.keys, categories);
  const fuse = new Fuse(categories, fuseOptions, fuseIndex);

  const handleIssueChange = (e) => {
    const inputText = e.target.value;
    setIssue(inputText);

    if (inputText.length >= 2) {
      // ตรวจสอบความยาวของข้อความ
      // แยกคำค้นหา
      const searchTerms = inputText.trim().split(/\s+/);

      // ค้นหาคำที่ใกล้เคียงสำหรับแต่ละคำ
      const searchResults = searchTerms.map((term) => fuse.search(term));

      // หา intersection ของผลลัพธ์
      const results = searchResults.reduce((a, b) =>
        a.filter((itemA) =>
          b.some((itemB) => itemA.item.name === itemB.item.name)
        )
      );

      // แสดงผลลัพธ์
      if (results.length > 0) {
        setShowSubOptions(true);
        setSelectedCategory({
          name: "ผลลัพธ์การค้นหา",
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
    lng: 100.5018, // longitude เริ่มต้น
  });
  const handleMarkerDragEnd = (e) => {
    setMarkerPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="tom">
        <label>หัวข้อ ร้องเรียน</label>
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
            ref={issueRef} // ใช้ issueRef ที่นี่
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

      <div className="tom">
        <label>สถานที่</label>
        {/* <LoadScript googleMapsApiKey="AIzaSyAka-ib6oCwDyXOKpbVUR6vUFo6EXQk6Rg">
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
        </LoadScript> */}
        <Map />
      </div>

      <div className="button-container">
        <div className="tom1">
          <label>เบอร์โทรศัพท์</label>
           {/* เพิ่ม name="phone" ใน input */}
           <input
          type="text"
          name="phone"  
          value={phone}
          onChange={handlePhoneChange}
          required
          className="large-inputs"
        />
          {phoneError && <div className="error">{phoneError}</div>}
               {/*  เพิ่ม input สำหรับ issue */}
      <div className="tom1">
        <label>Issue:</label>
        <input 
          type="text" 
          name="issue" 
          value={issue} 
          onChange={(e) => setIssue(e.target.value)} 
          required 
        />
      </div>
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