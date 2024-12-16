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

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchAttendanceList();
    };

    const handleReset = (e) => {
        e.preventDefault();
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
            <h2 className='attendance-history-title'>전체 출퇴근 기록</h2>
            
            {/* 검색 폼 */}
            <div className="search-form mb-4">
                <Form className="d-flex flex-wrap gap-3" onSubmit={handleSearch}>
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
                        <Form.Label>직급</Form.Label>
                        <Form.Control
                            type="text"
                            name="position"
                            value={searchParams.position}
                            onChange={handleSearchParamsChange}
                            placeholder="직급"
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
                        <button type="submit" className="attendance-search-button">
                            검색
                        </button>
                        <button type="button" onClick={handleReset} className="attendance-reset-button">
                            초기화
                        </button>
                    </div>
                </Form>
            </div>

            {/* 테이블 */}
            <Table className="custom-table" hover>
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>부서</th>
                        <th>직급</th>
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

export default AdminAttendancePage;