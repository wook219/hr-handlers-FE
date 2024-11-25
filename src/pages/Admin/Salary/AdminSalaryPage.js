import React, { useEffect, useState, useRef } from 'react';
import { getAllSalaryAPI, createSalaryAPI, deleteSalaryAPI, excelUploadSalaryAPI } from '../../../api/admin/index.js';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import AdminSalaryModalPage from "./AdminSalaryModalPage";

const AdminSalaryPage = () => {
    const [salaries, setSalaries] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState([
        { key: 'position', value: '', label: '직위', type: 'select', options: [], isDisable: false },
        { key: 'deptName', value: '', label: '부서', type: 'select', options: [], isDisable: false },
        { key: 'name', value: '', label: '이름', type: 'select', options: [], isDisable: false },
        { key: 'basicSalary', value: '', label: '지급총액', type: 'input', isDisable: false },
        { key: 'deduction', value: '', label: '공제총액', type: 'input', isDisable: false },
        { key: 'netSalary', value: '', label: '실지급액', type: 'input', isDisable: false },
        { key: 'payDate', value: '', label: '급여일', type: 'custom', isDisable: false },
    ]);
    const [selectedDate, setSelectedDate] = useState([
        { key: 'year', value: '', label: '급여연도', type: 'select', options: [2024], isDisable: true },
        { key: 'month', value: '', label: '급여월', type: 'select', options: [1,2,3,4,5,6,7,8,9,10,11,12], isDisable: false },
        { key: 'day', value: '', label: '급여일', type: 'select', options: [13], isDisable: true },
    ]);
    const [checkItems, setCheckItems] = useState([]); // 체크된 아이템을 담을 배열
    const fileInputRef = useRef(null); // 엑셀 업로드 버튼 관련

    useEffect(() => {
        getSalaries()
    }, []);

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
            salaries.forEach((el) => idArray.push(el.salayId));
            setCheckItems(idArray);
        }
        else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    }

    // 추가 버튼 클릭시 실행되는 함수
    const handleCreate = () => {
        setFormData([  // formData를 초기화
            { key: 'position', value: '', label: '직위', type: 'select', options: ['사원', '대리', '팀장'], isDisable: false },
            { key: 'deptName', value: '', label: '부서', type: 'select', options: ['재무팀', '개발팀'], isDisable: false },
            { key: 'name', value: '', label: '이름', type: 'select', options: ['홍길동', '김철수', '엘리스'], isDisable: false },
            { key: 'basicSalary', value: '', label: '지급총액', type: 'input', isDisable: false },
            { key: 'deduction', value: '', label: '공제총액', type: 'input', isDisable: false },
            { key: 'netSalary', value: '', label: '실지급액', type: 'input', isDisable: false },
            { key: 'payDate', value: '', label: '급여일', type: 'custom', isDisable: false },
        ]);
        setSelectedDate([  // SelectedDate 초기화
            { key: 'year', value: '', label: '급여연도', type: 'select', options: ['2024'], isDisable: true },
            { key: 'month', value: '', label: '급여월', type: 'select', options: ['1','2','3','4','5','6','7','8','9','10','11','12'], isDisable: false },
            { key: 'day', value: '', label: '급여일', type: 'select', options: ['13'], isDisable: true },
        ]);

        setModalType('create');
        setModalShow(true);
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

    // 추가, 수정 api
    const handleSubmit = async (data, selectedDate) => {
        let params = {};

        // 급여 정보 데이터 세팅
        data.forEach((item) => {
            if (item.value) {
                params[item.key] = item.value;
            }
        });

        // 급여일 데이터 세팅
        const year = "2024";
        const month = selectedDate.find(item => item.key === "month")?.value || "01";
        const day = "13";

        // api에 전달한 데이터 세팅
        params = {
            ...params,
            employeeId: 1, // todo 아이디는 나중에
            payDate: `${year}-${month.toString().padStart(2, '0')}-${day}`
        }

        console.log("data : ", data);
        console.log("selectedDate : ", selectedDate);
        console.log("params : ", params);
        
        const { response, error } = await createSalaryAPI(params);
        if (error) {
            console.log('에러 발생');
            return;
        }

        setModalShow(false);
        getSalaries();
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

        getSalaries();
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

        getSalaries();
    };

    return (
        <div className="">
            <h2 className="">급여 목록</h2>
            <div>
                <Button variant="primary" onClick={handleCreate}>
                    추가
                </Button>
                <Button variant="danger" onClick={handleDelete}>
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
                            <tr key={salary.salayId}>
                                <td>
                                    <input type='checkbox' name={`select-${salary.salayId}`}
                                        onChange={(e) => handleSingleCheck(e.target.checked, salary.salayId)}
                                        // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                                        checked={checkItems.includes(salary.salayId) ? true : false} />
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