import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './AttendanceButton.css';
import { getAttendanceAPI, checkInAPI, checkOutAPI } from '../../api/home/index';
import { useToast } from '../../context/ToastContext';

const AttendanceButton = () => {
    const [isWorking, setIsWorking] = useState(false);
    const [attendanceId, setAttendanceId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null); // 어떤 버튼이 클릭되었는지 추적
    const { showToast } = useToast();

    // 출근 상태 체크 함수
    const checkCurrentStatus = async () => {
        try {
            const attendanceData = await getAttendanceAPI();
            
            if (attendanceData) {
                setIsWorking(attendanceData.status === 'WORK');
                setAttendanceId(attendanceData.id);
                setCheckInTime(attendanceData.checkInTime);
                setCheckOutTime(attendanceData.checkOutTime);
            } else {
                setIsWorking(false);
                setAttendanceId(null);
                setCheckInTime(null);
                setCheckOutTime(null);
            }
        } catch (error) {
            console.error('출근 상태 확인 실패:', error);
        }
    };

    // 초기 로드 및 날짜 변경 감지
    useEffect(() => {
        checkCurrentStatus();

        // 현재 날짜의 자정 시간 계산
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeUntilMidnight = tomorrow - now;

        // 자정에 상태 리셋
        const midnightTimer = setTimeout(() => {
            checkCurrentStatus();
        }, timeUntilMidnight);

        return () => clearTimeout(midnightTimer);
    }, []);

    // 1분마다 현재 날짜 확인
    useEffect(() => {
        const interval = setInterval(() => {
            checkCurrentStatus();
        }, 60000);

        return () => clearInterval(interval);
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
 
    const handleAttendanceClick = (type) => {
        if ((type === 'checkIn' && checkInTime) || (type === 'checkOut' && checkOutTime)) {
            return; // 이미 처리된 버튼은 클릭 무시
        }
        setSelectedButton(type);
        setShowModal(true);
    };
 
    const handleClose = () => {
        setShowModal(false);
        setSelectedButton(null);
    };
 
    const handleConfirm = async () => {
        try {
            if (selectedButton === 'checkIn' && !checkInTime) {
                const response = await checkInAPI();
                setAttendanceId(response.id);
                setCheckInTime(response.checkInTime);
                setIsWorking(true);
                showToast('출근 처리되었습니다.', 'success');
            } else if (selectedButton === 'checkOut' && !checkOutTime) {
                const response = await checkOutAPI(attendanceId);
                setCheckOutTime(response.checkOutTime);
                setIsWorking(false);
                setAttendanceId(null);
                showToast('퇴근 처리되었습니다.', 'success');
            }
            handleClose();
        } catch (error) {
            showToast('처리중 오류가 발생하였습니다.', 'error');
        }
    };

    return (
        <>
            <div className="attendance-container">
                <div className="attendance-buttons">
                    <div 
                        className={`attendance-card ${checkInTime ? 'disabled' : ''}`}
                        onClick={() => !checkInTime && handleAttendanceClick('checkIn')}
                        style={{ 
                            cursor: checkInTime ? 'default' : 'pointer',
                            opacity: checkInTime ? 0.6 : 1
                        }}
                    >
                        <h5>출근</h5>
                        {checkInTime && (
                            <div className="time-display">
                                {formatTime(checkInTime)}
                            </div>
                        )}
                    </div>
                    <div 
                        className={`attendance-card ${checkOutTime || !checkInTime ? 'disabled' : ''}`}
                        onClick={() => !checkOutTime && checkInTime && handleAttendanceClick('checkOut')}
                        style={{ 
                            cursor: (checkOutTime || !checkInTime) ? 'default' : 'pointer',
                            opacity: (checkOutTime || !checkInTime) ? 0.6 : 1
                        }}
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
                    <Modal.Title>
                        {selectedButton === 'checkIn' ? '출근 확인' : '퇴근 확인'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedButton === 'checkIn' ? '출근 처리하시겠습니까?' : '퇴근 처리하시겠습니까?'}
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