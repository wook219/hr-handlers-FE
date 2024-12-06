import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const AdminSalaryExcelTypeModalPage = (props) => {
    const [excelTypeData, setExcelTypeData] = useState([
        { key: 'downloadScope', value: 'department', label: '' },
        { key: 'timePeriod', value: 'yearly', label: '' },
      ]);
    
      const handleChange = (key, value, label) => {
        setExcelTypeData((prevData) =>
          prevData.map((item) =>
            item.key === key ? { ...item, value, label } : item
          )
        );
        console.log("excelTypeData : ", excelTypeData);
      };

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    엑셀 다운로드 설정
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                {['radio'].map((type) => (
                <div key={`inline-${type}-downloadScope`} className="mb-3">
                    <Form.Check
                        inline
                        label="부서별"
                        name="downloadScope"
                        type={type}
                        id={`inline-${type}-department`}
                        defaultChecked
                        onChange={() => handleChange('downloadScope', 'department', '부서별')}
                    />
                    <Form.Check
                        inline
                        label="개인별"
                        name="downloadScope"
                        type={type}
                        id={`inline-${type}-individual`}
                        onChange={() => handleChange('downloadScope', 'individual', '개인별')}
                    />
                </div>
                ))}
                {['radio'].map((type) => (
                <div key={`inline-${type}-timePeriod`} className="mb-3">
                    <Form.Check
                        inline
                        label="연도별"
                        name="timePeriod"
                        type={type}
                        id={`inline-${type}-yearly`}
                        defaultChecked
                        onChange={() => handleChange('timePeriod', 'yearly', '연도별')}
                    />
                    <Form.Check
                        inline
                        label="월별"
                        name="timePeriod"
                        type={type}
                        id={`inline-${type}-monthly`}
                        onChange={() => handleChange('timePeriod', 'monthly', '월별')}
                    />
                </div>
            ))}
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    닫기
                </Button>
                <Button variant="primary" onClick={() => props.onSubmit(excelTypeData)}>
                    확인
                </Button>
            </Modal.Footer>
        </Modal>
    );

}


export default AdminSalaryExcelTypeModalPage;