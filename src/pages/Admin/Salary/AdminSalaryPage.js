import React, { useEffect, useState } from 'react';
import { getAllSalaryAPI, createSalaryAPI } from '../../../api/admin/index.js';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function MyVerticallyCenteredModal(props) {
    const [formData, setFormData] = useState({
        position: '',
        deptName: '',
        name: '',
        basicSalary: '',
        deduction: '',
        netSalary: '',
        payDate: '',
    });

    const [selectedDate, setSelectedDate] = useState({
        year: '',
        month: '',
        day: ''
    });

    useEffect(() => {
        if (props.formData) {
            setFormData({
                position: props.formData.position || '',
                deptName: props.formData.department || '',
                name: props.formData.name || '',
                basicSalary: props.formData.basicSalary || '',
                deduction: props.formData.deduction || '',
                netSalary: props.formData.netSalary || '',
                payDate: props.formData.payMonth || '',
            });
        }
    }, [props.formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setSelectedDate(prevSelectedDate => ({
            ...prevSelectedDate,
            [name]: value
        }));
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    급여 추가
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form.Label htmlFor="inputPassword5">부서</Form.Label>
                    <Form.Select
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                    >
                        <option>개발팀</option>
                        <option>재무팀</option>
                    </Form.Select>
                </div>
                <div>
                    <Form.Label htmlFor="inputPassword5">직위</Form.Label>
                    <Form.Select
                        id="deptName"
                        name="deptName"
                        value={formData.deptName}
                        onChange={handleChange}
                    >
                        <option>사원</option>
                        <option>대리</option>
                        <option>팀장</option>
                    </Form.Select>
                </div>
                <div>
                    <Form.Label htmlFor="inputPassword5">이름</Form.Label>
                    <Form.Select
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    >
                        <option>홍길동</option>
                        <option>엘리스</option>
                        <option>김철수</option>
                    </Form.Select>
                </div>
                <div>
                    <Form.Label htmlFor="inputPassword5">지급총액</Form.Label>
                    <Form.Control
                        type="number"
                        name="basicSalary"
                        value={formData.basicSalary}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Form.Label htmlFor="inputPassword5">공제총액</Form.Label>
                    <Form.Control
                        type="number"
                        name="deduction"
                        value={formData.deduction}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Form.Label htmlFor="inputPassword5">실지급액</Form.Label>
                    <Form.Control
                        type="number"
                        name="netSalary"
                        value={formData.netSalary}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Form.Label htmlFor="inputPassword5">급여연도</Form.Label>
                    <Form.Select
                        id="year"
                        name="year"
                        value={selectedDate.year}
                        onChange={handleDateChange}
                        disabled
                    >
                        <option>2024</option>
                    </Form.Select>
                </div>
                <div>
                    <Form.Label htmlFor="inputPassword5">급여월</Form.Label>
                    <Form.Select
                        id="month"
                        name="month"
                        value={selectedDate.month}
                        onChange={handleDateChange}
                    >
                        <option></option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                    </Form.Select>
                </div>
                <div>
                    <Form.Label htmlFor="inputPassword5">급여일</Form.Label>
                    <Form.Select
                        id="day"
                        name="day"
                        value={selectedDate.day}
                        onChange={handleDateChange}
                        disabled
                    >
                        <option>13</option>
                    </Form.Select>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    닫기
                </Button>
                <Button variant="primary" onClick={() => props.handleSubmit(formData, selectedDate)}>
                    저장
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

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
        console.log("response : ", response);
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
            </div>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                handleSubmit={handleSubmit}
                formData={formData}
            />
        </div>
    );

}

export default AdminSalaryPage;