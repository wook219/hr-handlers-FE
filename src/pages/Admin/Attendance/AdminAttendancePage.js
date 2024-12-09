import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import './AdminAttendancePage.css';
import { getAdminAttendanceAPI } from '../../../api/admin/attendance/index';

const AdminAttendancePage = () => {
    const [attendanceList, setAttendanceList] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchParams, setSearchParams] = useState({
        checkInTime: '',
        checkOutTime: '',
        department: '',
        position: '',
        employeeName: ''
    });

    const fetchAttendanceList = async () => {
        try {
            const params = {
                page: page,
                size: 10,
                ...searchParams
            };

            if (searchParams.checkInTime) {
                params.checkInTime = `${searchParams.checkInTime} 00:00:00`;
            }
            if (searchParams.checkOutTime) {
                params.checkOutTime = `${searchParams.checkOutTime} 23:59:59`;
            }

            const response = await getAdminAttendanceAPI(params);
            setAttendanceList(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('전체 출퇴근 기록 조회 실패:', error);
        }
    };

    useEffect(() => {
        fetchAttendanceList();
    }, [page]);

    const handleSearchParamsChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        setPage(0);
        fetchAttendanceList();
    };

    const handleReset = () => {
        setSearchParams({
            checkInTime: '',
            checkOutTime: '',
            department: '',
            position: '',
            employeeName: ''
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
            <h2>전체 출퇴근 기록</h2>
            
            {/* 검색 폼 */}
            <div className="search-form mb-4">
                <Form className="d-flex flex-wrap gap-3">
                    <Form.Group style={{ minWidth: '200px' }}>
                        <Form.Label>시작날짜</Form.Label>
                        <Form.Control
                            type="date"
                            name="checkInTime"
                            value={searchParams.checkInTime}
                            onChange={handleSearchParamsChange}
                        />
                    </Form.Group>
                    <Form.Group style={{ minWidth: '200px' }}>
                        <Form.Label>종료날짜</Form.Label>
                        <Form.Control
                            type="date"
                            name="checkOutTime"
                            value={searchParams.checkOutTime}
                            onChange={handleSearchParamsChange}
                        />
                    </Form.Group>
                    <Form.Group style={{ minWidth: '150px' }}>
                        <Form.Label>부서</Form.Label>
                        <Form.Control
                            type="text"
                            name="department"
                            value={searchParams.department}
                            onChange={handleSearchParamsChange}
                            placeholder="부서명"
                        />
                    </Form.Group>
                    <Form.Group style={{ minWidth: '150px' }}>
                        <Form.Label>직위</Form.Label>
                        <Form.Control
                            type="text"
                            name="position"
                            value={searchParams.position}
                            onChange={handleSearchParamsChange}
                            placeholder="직위"
                        />
                    </Form.Group>
                    <Form.Group style={{ minWidth: '150px' }}>
                        <Form.Label>이름</Form.Label>
                        <Form.Control
                            type="text"
                            name="employeeName"
                            value={searchParams.employeeName}
                            onChange={handleSearchParamsChange}
                            placeholder="사원명"
                        />
                    </Form.Group>
                    <div className="d-flex align-items-end gap-2">
                        <Button variant="primary" onClick={handleSearch} className="mb-3">
                            검색
                        </Button>
                        <Button variant="secondary" onClick={handleReset} className="mb-3">
                            초기화
                        </Button>
                    </div>
                </Form>
            </div>

            {/* 테이블 */}
            <Table className="custom-table" hover>
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>부서</th>
                        <th>직위</th>
                        <th>이름</th>
                        <th>출근 시간</th>
                        <th>퇴근 시간</th>
                        <th>근무 시간</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceList.map((record, index) => (
                        <tr key={index}>
                            <td>{formatDate(record.checkInTime)}</td>
                            <td>{record.deptName}</td>
                            <td>{record.position}</td>
                            <td>{record.name}</td>
                            <td>{formatTime(record.checkInTime)}</td>
                            <td>{formatTime(record.checkOutTime)}</td>
                            <td>{record.workingTime}분</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* 페이지네이션 */}
            <div className="pagination-container d-flex justify-content-center gap-2">
                <Button 
                    variant="outline-primary" 
                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                    disabled={page === 0}
                >
                    이전
                </Button>
                <span className="mx-3 align-self-center">
                    {page + 1} / {totalPages}
                </span>
                <Button 
                    variant="outline-primary" 
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={page >= totalPages - 1}
                >
                    다음
                </Button>
            </div>
        </div>
    );
};

export default AdminAttendancePage;