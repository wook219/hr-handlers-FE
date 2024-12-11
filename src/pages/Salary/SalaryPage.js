import React, { useEffect, useState } from 'react';
import { getSalaryAPI, excelDownloadSalaryAPI } from '../../api/index.js';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useToast } from '../../context/ToastContext';
import "./SalaryPage.css";

const SalaryPage = () => {
    const [salaries, setSalaries] = useState([]);

    const [size, setSize] = useState(15); // 한 페이지에 표시할 게시글 수
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
    const [pageGroupSize] = useState(10); // 한 번에 보여줄 페이지 번호 갯수
    const [totalElements, setTotalElements] = useState(0); // 총 게시글 수
    const totalPages = Math.ceil(totalElements / size); // 전체 페이지 수
    const currentPageGroup = Math.floor(currentPage / pageGroupSize); // 현재 페이지 그룹 계산
    const { showToast } = useToast();

    useEffect(() => {
        getSalaries(currentPage, size)
    }, [currentPage, size]);

    // 페이지네이션 핸들러
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        getSalaries(currentPage, size)
    }, []);

    const formatNumberWithCommas = (num) => {
        return num.toLocaleString("en-US");
    };

    const getSalaries = async (page, size) => {
        const { response, error } = await getSalaryAPI(page, size);
        if (error) {
            showToast('에러 발생', 'error');
            return;
        }

        // 지급총액, 공제총액, 실지급액 세자리마다 , 붙이는 로직
        const formattedData = response.data.data.content.map((item) => ({
            ...item,
            basicSalary: formatNumberWithCommas(item.basicSalary),
            deduction: formatNumberWithCommas(item.deduction),
            netSalary: formatNumberWithCommas(item.netSalary),
        }));


        setSalaries(formattedData);
        setTotalElements(response.data.data.totalElements); // 총 게시글 수 설정
    };

    // 엑셀 다운로드 api
    const handleExcelDownload = async () => {
        const { response, error } = await excelDownloadSalaryAPI();
        if (error) {
            showToast('에러 발생', 'error');
            return;
        }

        // Blob을 사용하여 파일 다운로드
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '급여관리.xlsx'); // 다운로드할 파일 이름
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 링크 요소 제거
    };


    return (
        <div className="salary-container">
            <h2 className="salary-container-h2">급여 목록</h2>
            <div className="mb-3" style={{ textAlign: "right" }}>
                <button className="salary-primary-btn" onClick={handleExcelDownload}>
                    엑셀 다운로드
                </button>
            </div>
            <div className="salary-table-responsive">
                <Table className="">
                    <thead>
                    <tr>
                        <th>직급</th>
                        <th>부서</th>
                        <th>이름</th>
                        <th>지급총액</th>
                        <th>공제총액</th>
                        <th>실지급액</th>
                        <th>급여일</th>
                    </tr>
                    </thead>
                    <tbody>
                        {salaries.map(salary => (
                            <tr key={salary.salayId}>
                                <td>{salary.position || 'N/A'}</td>
                                <td>{salary.deptName || 'N/A'}</td>
                                <td>{salary.name || 'N/A'}</td>
                                <td>{salary.basicSalary ? `${salary.basicSalary}원` : 'N/A'}</td>
                                <td>{salary.deduction ? `${salary.deduction}원` : 'N/A'}</td>
                                <td>{salary.netSalary ? `${salary.netSalary}원` : 'N/A'}</td>
                                <td>{salary.payDate || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            {/* 페이지네이션 UI */}
            <div className="pagination mt-3 d-flex justify-content-center">
                <ul className="pagination">
                {/* 맨 처음으로 이동 */}
                <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                    <button
                    className="page-link"
                    onClick={() => handlePageChange(0)}
                    disabled={currentPage === 0}
                    >
                    &laquo;
                    </button>
                </li>

                {/* 이전 그룹으로 이동 */}
                <li className={`page-item ${currentPageGroup === 0 ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange((currentPageGroup - 1) * pageGroupSize)}
                        disabled={currentPageGroup === 0}
                    >
                    &lt;
                    </button>
                </li>

                {/* 페이지 번호 표시 */}
                {[...Array(pageGroupSize)].map((_, index) => {
                    const pageIndex = currentPageGroup * pageGroupSize + index;
                    if (pageIndex >= totalPages) return null; // 전체 페이지를 초과하면 표시하지 않음
                    return (
                    <li
                        key={pageIndex}
                        className={`page-item ${currentPage === pageIndex ? "active" : ""}`}
                    >
                        <button className="page-link" onClick={() => handlePageChange(pageIndex)}>
                            {pageIndex + 1}
                        </button>
                    </li>
                    );
                })}

                {/* 다음 그룹으로 이동 */}
                <li
                    className={`page-item ${
                    currentPageGroup === Math.floor(totalPages / pageGroupSize) ? "disabled" : ""
                    }`}
                >
                    <button
                        className="page-link"
                        onClick={() => handlePageChange((currentPageGroup + 1) * pageGroupSize)}
                        disabled={currentPageGroup === Math.floor(totalPages / pageGroupSize)}
                    >
                    &gt;
                    </button>
                </li>

                {/* 맨 마지막으로 이동 */}
                <li
                    className={`page-item ${
                    currentPage === totalPages - 1 ? "disabled" : ""
                    }`}
                >
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                    &raquo;
                    </button>
                </li>
                </ul>
            </div>
        </div>
    );

}

export default SalaryPage;