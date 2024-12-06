import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { getVacationStatusAPI } from '../../api/admin/vacation'


const VacationStatusList = () => {
    const [vacationStatus, setVacationStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVacationStatus = async () => {
            try {
                setLoading(true);
                const data = await getVacationStatusAPI();
                setVacationStatus(data);
            } catch (err) {
                setError('휴가 현황을 불러오는데 실패했습니다.');
                console.error('Error fetching vacation status:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVacationStatus();
    }, []);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;

    return (
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
                {vacationStatus.map((status, index) => (
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
                ))}
            </tbody>
        </Table>
    );
}

export default VacationStatusList;