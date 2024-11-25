import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminSalaryModalPage = (props) => {
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
            console.log('props.formData : ', props.formData);
            setFormData({
                ...props.formData
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


export default AdminSalaryModalPage;