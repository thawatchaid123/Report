// components/RepairStats.js
import React, { useState, useEffect } from 'react';
import './RepairStats.css';

const RepairStats = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/PO/uploadd.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                // ตรวจสอบโครงสร้างข้อมูลที่ได้รับ
                console.log('Reports data:', data.reports);
                setReports(data.reports);
                setFilteredReports(data.reports);
            } else {
                setError('ไม่สามารถโหลดข้อมูลได้: ' + (data.error || ''));
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusDisplay = (status) => {
        // ตรวจสอบว่า status เป็น undefined หรือ null
        if (!status && status !== 0) return 'ไม่ระบุ';
        const statusCode = typeof status === 'string' ? parseInt(status, 10) : status;
        switch (statusCode) {
            case 1:
                return 'รอดำเนินการ';
            case 2:
                return 'เข้ารับการซ่อมแล้ว';
            case 3:
                return 'ดำเนินการเสร็จสิ้น';
            case 4:
                return 'ปฏิเสธการซ่อม';
            default:
                return `สถานะไม่ถูกต้อง (${statusCode})`;
        }
    };

    const getStatusColor = (status) => {
        if (!status && status !== 0) return 'inherit';
        const statusCode = typeof status === 'string' ? parseInt(status, 10) : status;
        return statusCode === 1 ? '#2ecc71' :
               statusCode === 2 ? '#f39c12' :
               statusCode === 3 ? '#3498db' :
               statusCode === 4 ? '#e74c3c' :
               '#666';
    };

    const getStatusClass = (status) => {
        if (!status && status !== 0) return '';
        const statusCode = typeof status === 'string' ? parseInt(status, 10) : status;
        switch (statusCode) {
            case 1:
                return 'status-pending';
            case 2:
                return 'status-in-progress';
            case 3:
                return 'status-completed';
            case 4:
                return 'status-rejected';
            default:
                return '';
        }
    };

    const handleFilter = (status) => {
        setFilter(status);
        if (status === 'all') {
            setFilteredReports(reports);
        } else {
            const statusNum = parseInt(status);
            setFilteredReports(reports.filter(report => 
                report.status && parseInt(report.status) === statusNum
            ));
        }
    };

    const handleShowImage = (imagePath) => {
        setSelectedImage(imagePath);
    };

    return (
        <div className="repair-stats">
            <h2>สถิติการซ่อม</h2>
            
            <div className="filter-buttons">
                <button 
                    onClick={() => handleFilter('all')} 
                    className={filter === 'all' ? 'active' : ''}
                >
                    ทั้งหมด
                </button>
                <button 
                    onClick={() => handleFilter(2)} 
                    className={filter === 2 ? 'active' : ''}
                >
                    เข้ารับการซ่อมแล้ว
                </button>
                <button 
                    onClick={() => handleFilter(3)} 
                    className={filter === 3 ? 'active' : ''}
                >
                    ดำเนินการเสร็จสิ้น
                </button>
                <button 
                    onClick={() => handleFilter(4)} 
                    className={filter === 4 ? 'active' : ''}
                >
                    ปฏิเสธการซ่อม
                </button>
                <button 
                    onClick={() => handleFilter(1)} 
                    className={filter === 1 ? 'active' : ''}
                >
                    รอดำเนินการ
                </button>
            </div>

            {isLoading && <div>กำลังโหลด...</div>}
            {error && <div className="error">{error}</div>}

            <div className="stats-table">
                <table>
                    <thead>
                        <tr>
                            <th>รหัส</th>
                            <th>ชื่อพนักงาน</th>
                            <th>ปัญหา</th>
                            <th>หมวดหมู่</th>
                            <th>สถานะ</th>
                            <th>วันที่</th>
                            <th>รูปภาพ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.map((report) => (
                            <tr key={report.id}>
                                <td>{report.id}</td>
                                <td>{report.employee_name || 'ไม่ระบุ'}</td>
                                <td>{report.issue || 'ไม่ระบุ'}</td>
                                <td>{report.category || 'ไม่ระบุ'}</td>
                                <td>
                                    <span 
                                        className={getStatusClass(report.status)}
                                        style={{
                                            color: getStatusColor(report.status),
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {getStatusDisplay(report.status)}
                                    </span>
                                </td>
                                <td>{report.created_at ? new Date(report.created_at).toLocaleDateString() : 'ไม่ระบุ'}</td>
                                <td>
                                    {report.image_path && (
                                        <button 
                                            onClick={() => handleShowImage(
                                                `data:image/jpeg;base64,${report.image_path}`
                                            )}
                                        >
                                            ดูรูปภาพ
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedImage && (
                <div className="image-modal">
                    <div className="modal-content">
                        <img src={selectedImage} alt="Repair evidence" />
                        <button onClick={() => setSelectedImage(null)}>ปิด</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepairStats;