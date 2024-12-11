import React, { useEffect, useState, useRef } from 'react';
import { 
        getAllSalaryAPI,
        searchSalaryAPI,
        createSalaryAPI,
        updateSalaryAPI,
        deleteSalaryAPI,
        excelUploadSalaryAPI,
        excelDownloadSalaryAPI
       } from '../../../api/admin/index.js';
import {
        getDepartmentAPI,
        } from "../../../api/employee/index";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useToast } from '../../../context/ToastContext';
import "./AdminSalaryPage.css";

import AdminSalaryModalPage from "./AdminSalaryModalPage";
import AdminSalarySearchPage from "./AdminSalarySearchPage";
import AdminSalaryExcelTypeModalPage from "./AdminSalaryExcelTypeModalPage";

const AdminSalaryPage = () => {
    const [size, setSize] = useState(10); // 한 페이지에 표시할 게시글 수
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
    const [pageGroupSize] = useState(10); // 한 번에 보여줄 페이지 번호 갯수
    const [totalElements, setTotalElements] = useState(0); // 총 게시글 수
    const totalPages = Math.ceil(totalElements / size); // 전체 페이지 수
    const currentPageGroup = Math.floor(currentPage / pageGroupSize); // 현재 페이지 그룹 계산
    const { showToast } = useToast();

    const [salaries, setSalaries] = useState([]); // 급여관리 조회 데이터
    const [modalShow, setModalShow] = useState(false); // 모달 사용 여부
    const [modalType, setModalType] = useState(''); // 모달 화면 타입(추가: create, 수정: update)
    const [checkItems, setCheckItems] = useState([]); // 체크된 아이템을 담을 배열

    const fileInputRef = useRef(null); // 엑셀 업로드 버튼 관련
    const [excelTypeModalShow, setExcelTypeModalShow] = useState(false); // 엑셀 다운로드 설정 모달 사용 여부

    const positionOptions = [
        { name: '선택', value: '' },
        { name: '사원', value: '사원' },
        { name: '대리', value: '대리' },
        { name: '과장', value: '과장' },
        { name: '팀장', value: '팀장' },
        { name: '대표', value: '대표' }
    ];
    const [deptNameOptions, setDeptNameOptions] = useState([
        { name: '선택', value: '' }
    ]);
    const nameOptions = [
        { name: '선택', value: '' },
    ];
    const [searchData, setSearchData] = useState([
        { key: 'startDate', value: '', label: '시작날짜', type: 'inputDate', isDisable: false },
        { key: 'endDate', value: '', label: '종료날짜', type: 'inputDate', isDisable: false },
        { key: 'position', value: '', label: '직급', type: 'select', options: positionOptions, isDisable: false },
        { key: 'deptName', value: '', label: '부서', type: 'select', options: deptNameOptions, isDisable: false },
        { key: 'name', value: '', label: '이름', type: 'inputText', isDisable: false },
    ]);
    const [formData, setFormData] = useState([
        { key: 'salaryId', value: '', label: '급여Id', type: 'custom', isDisable: false },
        { key: 'position', value: '', label: '직급', type: 'select', options: positionOptions, isDisable: false },
        { key: 'deptName', value: '', label: '부서', type: 'select', options: deptNameOptions, isDisable: false },
        { key: 'name', value: '', label: '이름', type: 'select', options: nameOptions, isDisable: false },
        { key: 'basicSalary', value: '', label: '지급총액', type: 'input', isDisable: false },
        { key: 'deduction', value: '', label: '공제총액', type: 'input', isDisable: false },
        { key: 'netSalary', value: '', label: '실지급액', type: 'input', isDisable: false },
        { key: 'payDate', value: '', label: '급여일', type: 'custom', isDisable: false },
    ]);
    const [selectedDate, setSelectedDate] = useState([
        { key: 'year', value: '', label: '급여연도', type: 'select', options: ['선택', 2023, 2024], isDisable: false },
        { key: 'month', value: '', label: '급여월', type: 'select', options: ['선택', 1,2,3,4,5,6,7,8,9,10,11,12], isDisable: false },
        { key: 'day', value: '', label: '급여일', type: 'select', options: [13], isDisable: true },
    ]);

    useEffect(() => {
        handleSearch(searchData, currentPage, size);
    }, [currentPage, size]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getDepartmentAPI({
                    page: 0,
                    size: 100,
                    keyword: "",
                });
                
                const data = response.content;
                setDeptNameOptions(prevOptions =>
                    prevOptions.concat(
                        data.map(item => ({
                            name: item.deptName,
                            value: item.deptName
                        }))
                    )
                );
                console.log("deptNameOptions : ", deptNameOptions);
            } catch (error) {
                showToast("부서 데이터를 가져오는 중 오류가 발생했습니다.", "error");
                return;
            }
        };
        fetchDepartments();
    }, [showToast]);

    useEffect(() => {
        setSearchData(prevData =>
            prevData.map(field =>
                field.key === 'deptName'
                    ? { ...field, options: deptNameOptions }
                    : field
            )
        );

        setFormData(prevData =>
            prevData.map(field =>
                field.key === 'deptName'
                    ? { ...field, options: deptNameOptions }
                    : field
            )
        );
    }, [deptNameOptions]);

    // 페이지네이션 핸들러
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // 체크박스 단일 선택
    const handleSingleCheck = (checked, id) => {
        if (checked) {
            // 단일 선택 시 체크된 아이템을 배열에 추가
            setCheckItems(prev => [...prev, id]);
        } else {
            // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
            setCheckItems(checkItems.filter((el) => el !== id));
        }
    };

    // 체크박스 전체 선택
    const handleAllCheck = (checked) => {
        if(checked) {
            // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
            const idArray = [];
            salaries.forEach((el) => idArray.push(el.salaryId));
            setCheckItems(idArray);
        }
        else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    }

    // 추가 버튼 클릭시 실행되는 함수
    const handleCreate = () => {
        // formData 초기화
        const createFormData = formData.map((field) => ({
            ...field,
            value: '',
            options: ['name'].includes(field.key) ? [{ name: "선택", value: "" }] : field.options,
            isDisable: ['position', 'deptName', 'name'].includes(field.key) ? false :
                ['netSalary'].includes(field.key) ? true : field.isDisable,
        }));
    
        // SelectedDate 초기화
        const createSelectedDate = selectedDate.map((dateField) => ({
            ...dateField,
            value: '',
        }));
    
        setFormData(createFormData);
        setSelectedDate(createSelectedDate);
        setModalType('create');
        setModalShow(true);
    };

    // row 더블클릭시 실행되는 함수(수정관련)
    const handleRowDoubleClick = (salary) => {

        const nameOptions = [{
            name: salary.name,
            value: salary.employeeId
        }];
        // 폼 데이터 업데이트
        const updatedFormData = formData.map((field) => {
            let updatedValue = salary[field.key];
            
            // 직급, 부서, 이름 셀렉트 박스 disable로 변경
            // 실지급액 disable 변경
            const isDisable = ['position', 'deptName', 'name', 'netSalary'].includes(field.key) ? true : field.isDisable;

            // 이름 필드일 경우 options 업데이트
            if (field.key === 'name') {
                // name 필드의 options만 업데이트
                return { 
                    ...field, 
                    value: updatedValue || "",
                    options: [...nameOptions],
                    isDisable
                };
            }
            
            
            return { ...field, value: updatedValue, isDisable };
        });

    
        // 날짜 데이터 업데이트
        const updatedSelectedDate = selectedDate.map((dateField) => {
            let value = salary.payDate ? new Date(salary.payDate) : null;
            if (dateField.key === 'year') value = value?.getFullYear();
            if (dateField.key === 'month') value = value?.getMonth() + 1;
            if (dateField.key === 'day') value = value?.getDate();
            return { ...dateField, value };
        });

        setFormData(updatedFormData);
        setSelectedDate(updatedSelectedDate);
    
        setModalShow(true);
        setModalType('update');
    };

    // 엑셀 업로드 버튼 클릭시 실행되는 함수
    const triggerFileInput = () => {
        fileInputRef.current.click(); // 숨겨진 input을 클릭
    };

    const formatNumberWithCommas = (num) => {
        return num.toLocaleString("en-US");
    };

    // 조회 api
    const getSalaries = async () => {
        const { response, error } = await getAllSalaryAPI();
        if (error) {
            return;
        }
        setSalaries(response.data.data);
    };

    // 검색 api
    const handleSearch = async (searchData, page, size) => {
        let params = {};

        searchData.forEach((item) => {
            if (item.value) {
                params[item.key] = item.value;
            }
        });

        const { response, error } = await searchSalaryAPI(params, page, size);
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

        setSearchData(searchData);
        setSalaries(formattedData);
        setTotalElements(response.data.data.totalElements); // 총 게시글 수 설정
    }

    // 추가, 수정 api
    const handleSubmit = async (data, selectedDate, modalType) => {
        let params = {};
        
        // 급여 정보 데이터 세팅
        data.forEach((item) => {
            if (item.value) {
                if(item.key === 'name') {
                    params['employeeId'] = item.value;
                }
                params[item.key] = item.value;
            }
        });

        // 급여일 데이터 세팅
        const year = selectedDate.find(item => item.key === "year").value;
        const month = selectedDate.find(item => item.key === "month").value;
        const day = selectedDate.find(item => item.key === "day")?.value || "13";

        // api에 전달한 데이터 세팅
        params = {
            ...params,
            payDate: `${year}-${month.toString().padStart(2, '0')}-${day}`
        }

        // 쉼표 제거 로직 추가
        Object.keys(params).forEach((key) => {
            if (typeof params[key] === "string" && params[key].includes(",")) {
                params[key] = params[key].replace(/,/g, "");
            }
        });

        if(modalType === 'create') {
            const { response, error } = await createSalaryAPI(params);
            if (error) {
                showToast('에러 발생', 'error');
                return;
            }
            showToast(response.data.message, 'success');
        } else if (modalType === 'update') {
            const { response, error } = await updateSalaryAPI(params);
            if (error) {
                showToast('에러 발생', 'error');
                return;
            }
            showToast(response.data.message, 'success');
        }

        setModalShow(false);
        handleSearch(searchData, currentPage, size)
    };

    // 삭제 api
    const handleDelete = async () => {
        const { response, error } = await deleteSalaryAPI(checkItems);
        if (error) {
            showToast('에러 발생', 'error');
            return;
        }
        showToast(response.data.message, 'success');

        handleSearch(searchData, currentPage, size)
    };

    // 엑셀 업로드 api
    const handleExcelUpload = async (event) => {
        const file = event.target.files[0]; // 첫 번째 파일만 처리
        if (!file) {
            showToast('파일이 선택되지 않았습니다.', 'error');
            return;
        }

        // FormData로 파일 전달
        const formData = new FormData();
        formData.append("file", file);

        const { response, error } = await excelUploadSalaryAPI(formData);
        if (error) {
            showToast('에러 발생', 'error');
            return;
        }
        showToast(response.data.message, 'success');

        handleSearch(searchData, currentPage, size)
    };

    // 엑셀 다운로드 api
    const handleExcelDownload = async () => {
        setExcelTypeModalShow(true);
    };

    const handleExcelSubmit = async (excelTypeData) => {
        const excelTypeParam = {};
        const searchParam = {};

        searchData.forEach((item) => {
            if (item.value) {
                searchParam[item.key] = item.value;
            }
        });

        excelTypeData.forEach((item) => {
            if (item.value) {
                excelTypeParam[item.key] = item.value;
            }
        });

        const params =  {
            excelTypeParam,
            searchParam
        }

        const { response, error } = await excelDownloadSalaryAPI(params);
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
        
        handleSearch(searchData, currentPage, size);
        setExcelTypeModalShow(false);
    };

    return (
        <div className="salary-container">
            <h2 className="salary-container-h2">급여 목록</h2>
            <div className="mb-3" style={{ textAlign: "right" }}>
                <button className="me-2 admin-salary-primary-btn" onClick={handleCreate}>
                    추가
                </button>
                <button className="me-2 admin-salary-secondary-btn" onClick={handleDelete}>
                    삭제
                </button>
                <button className="me-2 admin-salary-primary-btn" onClick={triggerFileInput}>
                    엑셀 업로드
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        ref={fileInputRef}
                        onChange={(e) => handleExcelUpload(e)}
                        style={{ display: "none" }}
                    />
                </button>
                <button className='admin-salary-primary-btn' onClick={handleExcelDownload}>
                    엑셀 다운로드
                </button>
            </div>
            <AdminSalarySearchPage
                searchData={searchData}
                handleSearch={handleSearch}
            />
            <div className="salary-table-responsive">
                <Table>
                    <thead>
                    <tr>
                        <th>
                            <input type='checkbox' name='select-all'
                            onChange={(e) => handleAllCheck(e.target.checked)}
                            // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                            checked={checkItems.length === salaries.length ? true : false} />
                        </th>
                        <th>직급</th>
                        <th>부서</th>
                        <th>이름</th>
                        <th>지급총액</th>
                        <th>공제총액</th>
                        <th>실지급액</th>
                        <th>급여일</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {salaries.map(salary => (
                            <tr key={salary.salaryId}  onDoubleClick={() => handleRowDoubleClick(salary)}>
                                <td>
                                    <input type='checkbox' name={`select-${salary.salaryId}`}
                                        onChange={(e) => handleSingleCheck(e.target.checked, salary.salaryId)}
                                        // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                                        checked={checkItems.includes(salary.salaryId) ? true : false} />
                                </td>
                                <td>{salary.position || 'N/A'}</td>
                                <td>{salary.deptName || 'N/A'}</td>
                                <td>{salary.name || 'N/A'}</td>
                                <td>{salary.basicSalary ? `${salary.basicSalary}원` : 'N/A'}</td>
                                <td>{salary.deduction ? `${salary.deduction}원` : 'N/A'}</td>
                                <td>{salary.netSalary ? `${salary.netSalary}원` : 'N/A'}</td>
                                <td>{salary.payDate || 'N/A'}</td>
                                <td>
                                    <button className='admin-salary-table-btn' onClick={() => handleRowDoubleClick(salary)}>
                                        수정
                                    </button>
                                </td>
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
            <AdminSalaryModalPage
                show={modalShow}
                onHide={() => setModalShow(false)}
                handleSubmit={handleSubmit}
                formData={formData}
                selectedDate={selectedDate}
                modalType={modalType}
            />
            <AdminSalaryExcelTypeModalPage
                show={excelTypeModalShow}
                onHide={() => setExcelTypeModalShow(false)}
                onSubmit={handleExcelSubmit}
            />
        </div>
    );

}

export default AdminSalaryPage;