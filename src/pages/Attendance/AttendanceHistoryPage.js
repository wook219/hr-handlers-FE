import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import './AttendanceHistoryPage.css';
import { getAttendanceHistoryAPI } from '../../api/attendance/index';

const AttendanceHistory = () => {
    const [attendanceList, setAttendanceList] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchDates, setSearchDates] = useState({
        checkInTime: '',
        checkOutTime: ''
    });

    const addHours = (date, hours) => {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);
        return newDate;
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = addHours(new Date(dateString), 9);
        return date.toISOString().split('T')[0];
    };

    // 초기 데이터 로딩 (전체 조회)
    useEffect(() => {
        fetchAttendanceHistory();
    }, [page]);  // page 변경시에만 재호출

    // 날짜 검색 시 데이터 로딩
    useEffect(() => {
        if (searchDates.checkInTime && searchDates.checkOutTime) {
            fetchAttendanceHistory();
            setPage(0);  // 날짜 검색 시 첫 페이지로 리셋
        }
    }, [searchDates]);  // searchDates 변경시에만 재호출


    const fetchAttendanceHistory = async () => {
        try {
            const params = {
                page: page,
                size: 10
            };

            // 날짜가 선택된 경우에만 날짜 파라미터 추가
            if (searchDates.checkInTime && searchDates.checkOutTime) {
                // 시간대를 고려한 날짜 변환
                const checkInDate = new Date(searchDates.checkInTime);
                const checkOutDate = new Date(searchDates.checkOutTime);
                
                // 서버로 전송 시 로컬 시간 기준으로 설정
                params.checkInTime = `${checkInDate.toLocaleDateString('ko-KR')} 00:00:00`;
                params.checkOutTime = `${checkOutDate.toLocaleDateString('ko-KR')} 23:59:59`;
            }

            const response = await getAttendanceHistoryAPI(params);
            setAttendanceList(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('출퇴근 기록 조회 실패:', error);
        }
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setSearchDates(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchReset = () => {
        setSearchDates({
            checkInTime: '',
            checkOutTime: ''
        });
        setPage(0);
    };

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
     
        return `${year}-${month}-${day}`;
     };
     
     const formatTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
     };

    return (
        <div className="attendance-history-container">
            <h2 className='attendance-history-title'>출퇴근 기록</h2>
            
            {/* 날짜 검색 폼 */}
            <div className="date-search-form mb-4">
                <Form className="d-flex align-items-center gap-3">
                    <Form.Group>
                        <Form.Label>시작날짜</Form.Label>
                        <Form.Control
                            type="date"
                            name="checkInTime"
                            value={searchDates.checkInTime}
                            onChange={handleDateChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>종료날짜</Form.Label>
                        <Form.Control
                            type="date"
                            name="checkOutTime"
                            value={searchDates.checkOutTime}
                            onChange={handleDateChange}
                        />
                    </Form.Group>
                    <Button 
                        variant="secondary" 
                        onClick={handleSearchReset}
                        className='attendance-reset-button'
                    >
                        초기화
                    </Button>
                </Form>
            </div>
 
            {/* 출퇴근 기록 테이블 */}
            <div className='custon-table-container'>
                <Table className='custom-table' hover>
                    <thead>
                        <tr>
                            <th>날짜</th>
                            <th>출근 시간</th>
                            <th>퇴근 시간</th>
                            <th>총 근무 시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceList.map((record, index) => (
                            <tr key={index}>
                                <td>{formatDate(record.date)}</td>
                                <td>{formatTime(record.checkInTime)}</td>
                                <td>{formatTime(record.checkOutTime)}</td>
                                <td>{record.workingTime}분</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
 
            {/* 페이지네이션 */}
            <div className="pagination-container d-flex justify-content-center">
                <ul className="pagination">
                    <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(0)} disabled={page === 0}>
                            &laquo;
                        </button>
                    </li>
                    <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(prev => Math.max(0, prev - 1))} disabled={page === 0}>
                            &lt;
                        </button>
                    </li>
                    <li className="page-item active">
                        <button className="page-link">
                            {page + 1}
                        </button>
                    </li>
                    <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(prev => prev + 1)} disabled={page >= totalPages - 1}>
                            &gt;
                        </button>
                    </li>
                    <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>
                            &raquo;
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
 };
 

export default AttendanceHistory;