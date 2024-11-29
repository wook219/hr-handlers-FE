import React, { useEffect, useState, useRef } from 'react';
import { getAllSalaryAPI, searchSalaryAPI, createSalaryAPI, updateSalaryAPI, deleteSalaryAPI, excelUploadSalaryAPI } from '../../../api/admin/index.js';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import AdminSalaryModalPage from "./AdminSalaryModalPage";
import AdminSalarySearchPage from "./AdminSalarySearchPage";

const AdminSalaryPage = () => {
    const [size, setSize] = useState(10); // 한 페이지에 표시할 게시글 수
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
    const [pageGroupSize] = useState(10); // 한 번에 보여줄 페이지 번호 갯수
    const [totalElements, setTotalElements] = useState(0); // 총 게시글 수
    const totalPages = Math.ceil(totalElements / size); // 전체 페이지 수
    const currentPageGroup = Math.floor(currentPage / pageGroupSize); // 현재 페이지 그룹 계산

    const [salaries, setSalaries] = useState([]); // 급여관리 조회 데이터
    const [modalShow, setModalShow] = useState(false); // 모달 사용 여부
    const [modalType, setModalType] = useState(''); // 모달 화면 타입(추가: create, 수정: update)
    const [checkItems, setCheckItems] = useState([]); // 체크된 아이템을 담을 배열
    const fileInputRef = useRef(null); // 엑셀 업로드 버튼 관련
    const positionOptions = [
        { name: '선택', value: '' },
        { name: '사원', value: '사원' },
        { name: '대리', value: '대리' },
        { name: '과장', value: '과장' },
        { name: '팀장', value: '팀장' },
        { name: '대표', value: '대표' }
    ];
    const deptNameOptions = [
        { name: '선택', value: '' },
        { name: '개발팀', value: '개발팀' },
        { name: '재무팀', value: '재무팀' }
    ];
    const nameOptions = [
        { name: '선택', value: '' },
        { name: '홍길동', value: '1' },
        { name: '김철수', value: '2' },
        { name: '엘리스', value: '3' }
    ];
    const [searchData, setSearchData] = useState([
        { key: 'startDate', value: '', label: '시작날짜', type: 'inputDate', isDisable: false },
        { key: 'endDate', value: '', label: '종료날짜', type: 'inputDate', isDisable: false },
        { key: 'position', value: '', label: '직위', type: 'select', options: positionOptions, isDisable: false },
        { key: 'deptName', value: '', label: '부서', type: 'select', options: deptNameOptions, isDisable: false },
        { key: 'name', value: '', label: '이름', type: 'inputText', isDisable: false },
    ]);
    const [formData, setFormData] = useState([
        { key: 'salaryId', value: '', label: '급여Id', type: 'custom', isDisable: false },
        { key: 'position', value: '', label: '직위', type: 'select', options: positionOptions, isDisable: false },
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
        handleSearch(searchData, currentPage, size)
    }, [currentPage, size]);

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
            isDisable: ['position', 'deptName', 'name'].includes(field.key) ? false : field.isDisable,
        }));
    
        // SelectedDate 초기화
        const createSelectedDate = selectedDate.map((dateField) => ({
            ...dateField,
            value: '',
        }));

        console.log("createFormData : ", createFormData);
        console.log("createSelectedDate : ", createSelectedDate);
    
        setFormData(createFormData);
        setSelectedDate(createSelectedDate);
        setModalType('create');
        setModalShow(true);
    };

    // row 더블클릭시 실행되는 함수(수정관련)
    const handleRowDoubleClick = (salary) => {
        // 폼 데이터 업데이트
        const updatedFormData = formData.map((field) => {
            let updatedValue = salary[field.key];

            // select 타입의 경우 value를 options에서 매칭된 값으로 변환
            if (field.type === 'select' && field.options) {
                const matchedOption = field.options.find(option => option.value === updatedValue || option.name === updatedValue);
                updatedValue = matchedOption ? matchedOption.value : ''; // 매칭되지 않으면 기본값 설정
            }
            
            // 직위, 부서, 이름 셀렉트 박스 disable로 변경
            const isDisable = ['position', 'deptName', 'name'].includes(field.key) ? true : field.isDisable;
            
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

        console.log("salary : ", salary);
        console.log("updatedFormData : ", updatedFormData);
        console.log("updatedSelectedDate : ", updatedSelectedDate);
    
        setFormData(updatedFormData);
        setSelectedDate(updatedSelectedDate);
    
        setModalShow(true);
        setModalType('update');
    };

    // 엑셀 업로드 버튼 클릭시 실행되는 함수
    const triggerFileInput = () => {
        fileInputRef.current.click(); // 숨겨진 input을 클릭
    };

    // 조회 api
    const getSalaries = async () => {
        const { response, error } = await getAllSalaryAPI();
        console.log("response : ", response);
        if (error) {
            console.log('에러 발생');
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
            console.log('에러 발생');
            return;
        }

        console.log("searchData : ", searchData);
        console.log("params : ", params);
        console.log("response : ", response);

        setSearchData(searchData);
        setSalaries(response.data.data.content);
        setTotalElements(response.data.data.totalElements); // 총 게시글 수 설정
    }

    // 추가, 수정 api
    const handleSubmit = async (data, selectedDate, modalType) => {
        let params = {};
        
        // 급여 정보 데이터 세팅
        data.forEach((item) => {
            if (item.value) {
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
            employeeId: 1, // todo 아이디는 나중에
            payDate: `${year}-${month.toString().padStart(2, '0')}-${day}`
        }

        console.log('modalType : ', modalType);
        console.log("data : ", data);
        console.log("selectedDate : ", selectedDate);
        console.log("params : ", params);

        if(modalType === 'create') {
            const { response, error } = await createSalaryAPI(params);
            if (error) {
                console.log('에러 발생');
                return;
            }
        } else if (modalType === 'update') {
            const { response, error } = await updateSalaryAPI(params);
            if (error) {
                console.log('에러 발생');
                return;
            }
        }

        setModalShow(false);
        handleSearch(searchData, currentPage, size)
    };

    // 삭제 api
    const handleDelete = async () => {
        console.log('checkItems : ', checkItems);
        const { response, error } = await deleteSalaryAPI(checkItems);
        console.log("response : ", response);
        if (error) {
            console.log('에러 발생');
            return;
        }

        handleSearch(searchData, currentPage, size)
    };

    // 엑셀 업로드 api
    const handleDrop = async (event) => {
        const file = event.target.files[0]; // 첫 번째 파일만 처리
        if (!file) {
            console.log("파일이 선택되지 않았습니다.");
            return;
        }

        // FormData로 파일 전달
        const formData = new FormData();
        formData.append("file", file);

        const { response, error } = await excelUploadSalaryAPI(formData);
        if (error) {
            console.log("에러 발생");
            return;
        }

        handleSearch(searchData, currentPage, size)
    };

    return (
        <div className="">
            <h2 className="">급여 목록</h2>
            <AdminSalarySearchPage
                searchData={searchData}
                handleSearch={handleSearch}
            />
            <div className="mb-3" style={{ textAlign: "right" }}>
                <Button className="me-2" variant="primary" onClick={handleCreate}>
                    추가
                </Button>
                <Button className="me-2" variant="danger" onClick={handleDelete}>
                    삭제
                </Button>
                <Button variant="success" onClick={triggerFileInput}>
                    엑셀 업로드
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        ref={fileInputRef}
                        onChange={(e) => handleDrop(e)}
                        style={{ display: "none" }}
                    />
                </Button>
            </div>
            <div>
                <Table className="">
                    <thead>
                    <tr>
                        <th>
                            <input type='checkbox' name='select-all'
                            onChange={(e) => handleAllCheck(e.target.checked)}
                            // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                            checked={checkItems.length === salaries.length ? true : false} />
                        </th>
                        <th>직위</th>
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
                                <td>{salary.basicSalary || 'N/A'}</td>
                                <td>{salary.deduction || 'N/A'}</td>
                                <td>{salary.netSalary || 'N/A'}</td>
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
            <AdminSalaryModalPage
                show={modalShow}
                onHide={() => setModalShow(false)}
                handleSubmit={handleSubmit}
                formData={formData}
                selectedDate={selectedDate}
                modalType={modalType}
            />
        </div>
    );

}

export default AdminSalaryPage;