import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminSalaryModalPage = (props) => {
    const [formData, setFormData] = useState([
        { key: 'salaryId', value: '', label: '급여Id', type: 'custom', isDisable: false },
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

    const [modalType, setModalType] = useState('');

    useEffect(() => {
        if (props.formData) {
            setFormData(prevFormData =>
                prevFormData.map(field => {
                    const updatedField = props.formData.find(item => item.key === field.key);
                    return updatedField;
                })
            );
        }
    }, [props.formData]);

    useEffect(() => {
        if (props.selectedDate) {
            setSelectedDate(prevSelectedDate =>
                prevSelectedDate.map(field => {
                    const updatedField = props.selectedDate.find(item => item.key === field.key);
                    return updatedField;
                })
            );
        }
    }, [props.selectedDate]);

    useEffect(() => {
        if (props.modalType) {
            setModalType(props.modalType);
        }
    }, [props.modalType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) =>
            prevFormData.map((field) => {
                if (field.key === name) {
                    if (field.type === "input") {
                        // 숫자 필드는 쉼표를 추가
                        const rawValue = value.replace(/,/g, ""); // 쉼표 제거
                        if (!isNaN(rawValue) && rawValue !== "") {
                            if (field.key === "deduction") {
                                const basicSalaryField = prevFormData.find((f) => f.key === "basicSalary");
                                const basicSalary = basicSalaryField?.value
                                    ? Number(basicSalaryField.value.replace(/,/g, ""))
                                    : 0;
                                const deduction = Number(rawValue);
            
                                // deduction이 basicSalary보다 크면 업데이트하지 않음
                                if (deduction >= basicSalary) {
                                    alert("공제 금액은 지급 총액보다 클 수 없습니다.");
                                    return field; // 변경 없이 기존 값 유지
                                }
                            }
                            return {
                                ...field,
                                value: Number(rawValue).toLocaleString("en-US"),
                            };
                        }
                        return { ...field, value: "" }; // 빈 값 처리
                    }
                    return { ...field, value }; // 다른 필드는 그냥 업데이트
                }
                return field;
            })
        );
        // 위에서 차액 계산하면 한박자 느리게 계산됌 ㄷㄷ;;
        setFormData((prevFormData) =>
            prevFormData.map((field) => {
                // netSalary 계산
                if (field.key === "netSalary") {
                    const basicSalaryField = prevFormData.find((f) => f.key === "basicSalary");
                    const deductionField = prevFormData.find((f) => f.key === "deduction");

                    const basicSalary = basicSalaryField?.value ? Number(basicSalaryField.value.replace(/,/g, "")) : 0;
                    const deduction = deductionField?.value ? Number(deductionField.value.replace(/,/g, "")) : 0;

                    const calculatedNetSalary = Math.max(basicSalary - deduction, 0);

                    return {
                        ...field,
                        value: !isNaN(calculatedNetSalary)
                            ? calculatedNetSalary.toLocaleString("en-US")
                            : "",
                    };
                }
                return field;
            })
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
                        {field.type != 'custom' ? ( <Form.Label htmlFor={field.key}>{field.label}</Form.Label> ) : null}
                        {field.type === 'select' ? (
                            <Form.Select
                                id={field.key}
                                name={field.key}
                                value={field.value}
                                onChange={handleChange}
                                disabled={field.isDisable}
                            >
                                {field.options?.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.name}
                                    </option>
                                ))}
                            </Form.Select>
                        ) : field.type === 'input' ? (
                            <Form.Control
                                type="text"
                                name={field.key}
                                value={field.value}
                                onChange={handleChange}
                                disabled={field.isDisable}
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
                <Button variant="primary" onClick={() => props.handleSubmit(formData, selectedDate, modalType)}>
                    저장
                </Button>
            </Modal.Footer>
        </Modal>
    );

}


export default AdminSalaryModalPage;