import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { getVacationStatusAPI } from '../../api/admin/vacation'


const VacationStatusList = () => {
    const [vacationStatus, setVacationStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchVacationStatus = async () => {
        try {
            setLoading(true);
            const response = await getVacationStatusAPI(page);
            setVacationStatus(response.content); 
            setTotalPages(response.totalPages); 
        } catch (err) {
            setError('휴가 현황을 불러오는데 실패했습니다.');
            console.error('Error fetching vacation status:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVacationStatus();
    }, [page]);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="vacation-management-container">
            <Table className="admin-vacation-table" hover>
                <thead>
                    <tr>
                        <th>직급</th>
                        <th>부서</th>
                        <th>이름</th>
                        <th>연차</th>
                        <th>반차</th>
                        <th>병가</th>
                        <th>공가</th>
                        <th>총 사용일수</th>
                        <th>잔여일수</th>
                    </tr>
                </thead>
                <tbody>
                    {vacationStatus?.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="text-center">휴가 현황 데이터가 없습니다.</td>
                        </tr>
                    ) : (
                        vacationStatus?.map((status, index) => (
                            <tr key={index}>
                                <td>{status.position}</td>
                                <td>{status.deptName}</td>
                                <td>{status.name}</td>
                                <td>{status.annualLeave}</td>
                                <td>{status.halfLeave}</td>
                                <td>{status.sickLeave}</td>
                                <td>{status.publicLeave}</td>
                                <td>{status.totalUsed}</td>
                                <td>{status.remainingDays}</td>
                            </tr>
                        ))
                    )}
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
}

export default VacationStatusList;