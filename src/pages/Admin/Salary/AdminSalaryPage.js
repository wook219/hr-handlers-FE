import React, { useEffect, useState } from 'react';
import { getAllSalaryAPI, createSalaryAPI, excelUploadSalaryAPI } from '../../../api/admin/index.js';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import AdminSalaryModalPage from "./AdminSalaryModalPage";

const AdminSalaryPage = () => {
    const [salaries, setSalaries] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [formData, setFormData] = useState({
        position: '',
        deptName: '',
        name: '',
        basicSalary: '',
        deduction: '',
        netSalary: '',
        payDate: '',
    });

    useEffect(() => {
        getSalaries()
    }, []);

    const handleCreate = () => {
        setFormData({  // formData를 초기화
            position: '',
            deptName: '',
            name: '',
            basicSalary: '',
            deduction: '',
            netSalary: '',
            payDate: '',
        });
        setModalShow(true);
    };

    // 추가, 수정 api
    const handleSubmit = async (data, selectedDate) => {
        
        const params = {
            employeeId: 1,
            basicSalary: data.basicSalary,
            deduction: data.deduction,
            netSalary: data.netSalary,
            payDate: "2024" + "-"+ (selectedDate.month).toString().padStart(2, '0') + "-" + "13"
        };

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
                <Table className="">
                    <thead>
                    <tr>
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
            <div>
                <Button variant="primary" onClick={handleCreate}>
                    추가
                </Button>
                <h2>Excel 파일 업로드</h2>
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={(e) => handleDrop(e)}
                    />
            </div>
            <AdminSalaryModalPage
                show={modalShow}
                onHide={() => setModalShow(false)}
                handleSubmit={handleSubmit}
                formData={formData}
            />
        </div>
    );

}

export default AdminSalaryPage;