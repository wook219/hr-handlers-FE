import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './AttendanceButton.css';
import { getAttendanceAPI, checkInAPI, checkOutAPI } from '../../api/home/index';

const AttendanceButton = () => {
    const [isWorking, setIsWorking] = useState(false);
    const [attendanceId, setAttendanceId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    useEffect(() => {
        const checkCurrentStatus = async () => {
            try {
                const attendanceData = await getAttendanceAPI();
                
                if (attendanceData) {  // 오늘 출근 기록이 있는 경우
                    setIsWorking(attendanceData.status === 'WORK');
                    setAttendanceId(attendanceData.id);
                    setCheckInTime(attendanceData.checkInTime);
                    setCheckOutTime(attendanceData.checkOutTime);
                } else {  // 오늘 출근 기록이 없는 경우
                    setIsWorking(false);
                    setAttendanceId(null);
                    setCheckInTime(null);
                    setCheckOutTime(null);
                }
            } catch (error) {
                console.error('출근 상태 확인 실패:', error);
            }
        };
    
        checkCurrentStatus();
    }, []);

    const formatTime = (timeString) => {
        const date = new Date(timeString);
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}시 ${minutes}분`;
    };
 
    const handleAttendanceClick = () => {
        setShowModal(true);
    };
 
    const handleClose = () => {
        setShowModal(false);
    };
 
    // 출/퇴근 처리
    const handleConfirm = async () => {
        try {
            if (!isWorking) {
                // 출근 처리
                const response = await checkInAPI();
                setAttendanceId(response.id);
                setCheckInTime(response.checkInTime);
                setIsWorking(true);
            } else {
                // 퇴근 처리
                const response = await checkOutAPI(attendanceId);
                setCheckOutTime(response.checkOutTime);
                setIsWorking(false);
                setAttendanceId(null);
            }
            handleClose();
        } catch (error) {
            console.error('출/퇴근 처리 실패:', error);
        }
    };

    return (
        <>
            <div className="attendance-container">
                <div className="attendance-buttons">
                    <div 
                        className="attendance-card"
                        onClick={handleAttendanceClick}
                    >
                        <h5>출근</h5>
                        {checkInTime && (
                            <div className="time-display">
                                {formatTime(checkInTime)}
                            </div>
                        )}
                    </div>
                    <div 
                        className="attendance-card"
                        onClick={handleAttendanceClick}
                    >
                        <h5>퇴근</h5>
                        {checkOutTime && (
                            <div className="time-display">
                                {formatTime(checkOutTime)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
 
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isWorking ? '퇴근 확인' : '출근 확인'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isWorking ? '퇴근 처리하시겠습니까?' : '출근 처리하시겠습니까?'}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        확인
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
 };

export default AttendanceButton;