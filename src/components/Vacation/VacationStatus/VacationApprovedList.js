import React, { useState, useEffect } from 'react';
import VacationTable from './VacationTable';
import { Button } from 'react-bootstrap';
import './VacationStatus.css';
import { getApprovedVacationsAPI } from '../../../api/vacation/index';

const VacationApprovedList = () => {
    const [approvedVacations, setApprovedVacations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchApprovedVacations = async () => {
        try {
            setLoading(true);
            const response = await getApprovedVacationsAPI(page);
            setApprovedVacations(response.content);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError('승인된 휴가 목록을 불러오는데 실패했습니다.');
            console.error('Error fetching approved vacations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedVacations();
    }, [page]);

    const headers = ['문서 번호', '신청 일자', '제목', '시작 일자', '종료 일자', '승인 상태', '확정 일자', '결재자'];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const renderRow = (vacation, index) => (
        <tr key={index}>
            <td>{vacation.docNum}</td>
            <td>{formatDate(vacation.updatedAt)}</td>
            <td>{vacation.title}</td>
            <td>{formatDate(vacation.startDate)}</td>
            <td>{formatDate(vacation.endDate)}</td>
            <td>{vacation.status === "APPROVED" ? "확정" : "반려"}</td>
            <td>{formatDate(vacation.approvedAt)}</td>
            <td>{vacation.approver}</td>
        </tr>
    );

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h4 className='vacation-section-title'>승인 휴가 목록</h4>
            <VacationTable 
                headers={headers}
                data={approvedVacations}
                rowRenderer={renderRow}
                type="approved"  // 테이블 타입 지정
            />
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

export default VacationApprovedList;