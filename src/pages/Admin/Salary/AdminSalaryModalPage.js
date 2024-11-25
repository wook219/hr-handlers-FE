import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminSalaryModalPage = (props) => {
    const [formData, setFormData] = useState([
        { key: 'position', value: '', label: '직위', type: 'select', isDisable: false },
        { key: 'deptName', value: '', label: '부서', type: 'select', isDisable: false },
        { key: 'name', value: '', label: '이름', type: 'select', isDisable: false },
        { key: 'basicSalary', value: '', label: '지급총액', type: 'input', isDisable: false },
        { key: 'deduction', value: '', label: '공제총액', type: 'input', isDisable: false },
        { key: 'netSalary', value: '', label: '실지급액', type: 'input', isDisable: false },
        { key: 'payDate', value: '', label: '급여일', type: 'custom', isDisable: false },
    ]);

    const [selectedDate, setSelectedDate] = useState([
        { key: 'year', value: '', label: '급여연도', type: 'select', isDisable: true },
        { key: 'month', value: '', label: '급여월', type: 'select', isDisable: false },
        { key: 'day', value: '', label: '급여일', type: 'select', isDisable: true },
    ]);

    useEffect(() => {
        if (props.formData) {
            setFormData(prevFormData =>
                prevFormData.map(field => {
                    const updatedField = props.formData.find(item => item.key === field.key);
                    return updatedField ? { ...field, value: updatedField.value, options: updatedField.options } : field;
                })
            );
        }
    }, [props.formData]);

    useEffect(() => {
        if (props.selectedDate) {
            setSelectedDate(prevSelectedDate =>
                prevSelectedDate.map(field => {
                    const updatedField = props.selectedDate.find(item => item.key === field.key);
                    return updatedField ? { ...field, value: updatedField.value, options: updatedField.options } : field;
                })
            );
        }
    }, [props.selectedDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) =>
            prevFormData.map((field) =>
                field.key === name ? { ...field, value } : field
            )
        );
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setSelectedDate((prevSelectedDate) =>
            prevSelectedDate.map((field) =>
                field.key === name ? { ...field, value } : field
            )
        );
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
                {formData.map((field) => (
                    <div key={field.key}>
                        <Form.Label htmlFor={field.key}>{field.label}</Form.Label>
                        {field.type === 'select' ? (
                            <Form.Select
                                id={field.key}
                                name={field.key}
                                value={field.value}
                                onChange={handleChange}
                                disabled={field.isDisable}
                            >
                                {field.options?.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Select>
                        ) : field.type === 'input' ? (
                            <Form.Control
                                type="number"
                                name={field.key}
                                value={field.value}
                                onChange={handleChange}
                            />
                        ) : null}
                    </div>
                ))}
                {selectedDate.map((field) => (
                    <div key={field.key}>
                        <Form.Label htmlFor={field.key}>{field.label}</Form.Label>
                        {field.type === 'select' ? (
                            <Form.Select
                                id={field.key}
                                name={field.key}
                                value={field.value}
                                onChange={handleDateChange}
                                disabled={field.isDisable}
                            >
                                {field.options?.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Select>
                        ) : null}
                    </div>
                ))}
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