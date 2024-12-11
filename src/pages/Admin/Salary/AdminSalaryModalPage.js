import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useToast } from '../../../context/ToastContext';
import { searchEmployeeAPI } from '../../../api/admin/index.js';

const AdminSalaryModalPage = (props) => {
    const [formData, setFormData] = useState([
        { key: 'salaryId', value: '', label: '급여Id', type: 'custom', isDisable: false },
        { key: 'position', value: '', label: '직급', type: 'select', isDisable: false },
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
    const { showToast } = useToast();

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

    useEffect(() => {
        const positionField = formData.find((field) => field.key === "position");
        const deptNameField = formData.find((field) => field.key === "deptName");
    
        const positionValue = positionField?.value || "";
        const deptNameValue = deptNameField?.value || "";

        if(positionValue && deptNameValue && modalType == 'create') {
            getUserData();
        }
    }, [
        formData.find((field) => field.key === "position")?.value,
        formData.find((field) => field.key === "deptName")?.value,
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            const updatedFormData = prevFormData.map((field) => {
                if (field.key === name) {
                    if (field.type === "input") {
                        const rawValue = value.replace(/,/g, "");
                        if (!isNaN(rawValue) && rawValue !== "") {
                            if (field.key === "deduction") {
                                const basicSalaryField = prevFormData.find((f) => f.key === "basicSalary");
                                const basicSalary = basicSalaryField?.value
                                    ? Number(basicSalaryField.value.replace(/,/g, ""))
                                    : 0;
                                const deduction = Number(rawValue);
    
                                if (deduction >= basicSalary) {
                                    showToast('공제 금액은 지급 총액보다 클 수 없습니다.', 'error');
                                    return field;
                                }
                            }
                            return {
                                ...field,
                                value: Number(rawValue).toLocaleString("en-US"),
                            };
                        }
                        return { ...field, value: "" };
                    }
                    return { ...field, value };
                }
                return field;
            });
    
            // netSalary 계산
            const basicSalaryField = updatedFormData.find((f) => f.key === "basicSalary");
            const deductionField = updatedFormData.find((f) => f.key === "deduction");
            const netSalaryFieldIndex = updatedFormData.findIndex((f) => f.key === "netSalary");
    
            const basicSalary = basicSalaryField?.value ? Number(basicSalaryField.value.replace(/,/g, "")) : 0;
            const deduction = deductionField?.value ? Number(deductionField.value.replace(/,/g, "")) : 0;
    
            const calculatedNetSalary = Math.max(basicSalary - deduction, 0);
    
            if (netSalaryFieldIndex > -1) {
                updatedFormData[netSalaryFieldIndex] = {
                    ...updatedFormData[netSalaryFieldIndex],
                    value: calculatedNetSalary.toLocaleString("en-US"),
                };
            }
    
            return updatedFormData;
        });
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setSelectedDate((prevSelectedDate) =>
            prevSelectedDate.map((field) =>
                field.key === name ? { ...field, value } : field
            )
        );
    };

    const getUserData = async () => {
        // position과 deptName 추출
        const position = formData.find((field) => field.key === "position")?.value || "";
        const deptName = formData.find((field) => field.key === "deptName")?.value || "";

        // params 객체 생성
        const params = {
            position,
            deptName,
        };

        const { response, error } = await searchEmployeeAPI(params);
        if (error) {
            showToast('에러 발생', 'error');
            return;
        }

        const nameOptions = response.data.data.map(employee => ({
            name: employee.name,
            value: employee.empNo  // 예시로 empNo를 value로 사용
        }));
    
        // name 필드의 options만 업데이트
        const updatedFormData = formData.map((field) => {
            if (field.key === 'name') {
                // name 필드의 options만 업데이트
                return { ...field, options: [{ name: "선택", value: "" }, ...nameOptions] };
            }
            return field; // 다른 필드는 그대로 유지
        });

        setFormData(updatedFormData);
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
                <button className='admin-salary-secondary-btn' onClick={props.onHide}>
                    닫기
                </button>
                <button className='admin-salary-primary-btn' onClick={() => props.handleSubmit(formData, selectedDate, modalType)}>
                    저장
                </button>
            </Modal.Footer>
        </Modal>
    );

}


export default AdminSalaryModalPage;