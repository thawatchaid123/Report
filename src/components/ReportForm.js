import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Fuse from "fuse.js";
import React, { useState, useRef } from "react";

const ReportForm = ({ onSubmit }) => {
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState("");
  const [category, setCategory] = useState(""); 
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
    formData.append("category", category);

    for (let i = 0; i < photos.length; i++) {
      formData.append("photos[]", photos[i]);
    }

    try {
      const response = await axios.post('/uploadd.php', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", response.data);
      if (response.data.error) {
        console.error("Server error:", response.data.error);
      } else {
        onSubmit(response.data); 
        setPhone("");
        setPhotos([]);
        setHasPhoto(false);
        setCategory("");
        navigate("/complaintform");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePhoneChange = (e) => {
    const inputPhone = e.target.value;
    const numericPhone = inputPhone.replace(/[^0-9]/g, "");

    if (numericPhone.length === 1 && numericPhone !== "0") {
      setPhoneError("เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0");
      return;
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
      name: "เครื่องจักรกลึง",
      subOptions: [
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
      ],
    },
    {
      name: "เครื่องจักรฝน",
      subOptions: [
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
      ],
    },
    {
      name: "เครื่องจักรกัด",
      subOptions: [
        "C1",
        "C2",
        "C3",
        "C4",
        "C5",
      ],
    },
    {
      name: "เครื่องจักรเจาะ",
      subOptions: [
        "D",
        " D2.",
        "D3",
        "D",
      ],
    },
    {
      name: "เครื่องจักรปั๊ม",
      subOptions: [
        "G1",
        "G2",
        "G3",
        "G4 ",
        "G5",
        "G6",
      ],
    },
    {
      name: "เครื่องจักรรอย",
      subOptions: [
        "H1",
        "H2",
        "H3",
        "H4",
      ],
    },
    {
      name: "เครื่องจักรประกอบอัตโนมัติ",
      subOptions: [
        "Q1",
        "Q2",
        "Q3  ",
        "Q4",
        "Q5",
        "Q6",
        "Q7",
      ],
    },
    {
      name: "เครื่องจักรบรรจุภัณฑ์",
      subOptions: [
        "W1",
        "W2",
        "W3",
        "W4 ",
      ],
    },
  ];

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
      const searchTerms = inputText.trim().split(/\s+/);
      const searchResults = searchTerms.map((term) => fuse.search(term));
      const results = searchResults.reduce((a, b) =>
        a.filter((itemA) =>
          b.some((itemB) => itemA.item.name === itemB.item.name)
        )
      );

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="tom">
        <label>หมวดหมู่ เครื่องจักร</label>
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
            ref={issueRef} 
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
              style={{ display: "none" }} 
            />
            {hasPhoto && <i className="fas fa-check photo-attached-icon"></i>}
          </label>
        </div>
      </div>


      <div className="button-container">
        <div className="tom1">
          <label>หมายเลขพนักงาน</label>
          <input
            type="text"
            name="phone"  
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