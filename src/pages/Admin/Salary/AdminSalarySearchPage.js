import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Form from 'react-bootstrap/Form';
import "./AdminSalaryPage.css";

const AdminSalarySearchPage = (props) => {
    const [searchData, setSearchData] = useState(props.searchData || []);

    useEffect(() => {
        setSearchData(props.searchData);
    }, [props.searchData]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData((searchData) =>
            searchData.map((field) =>
                field.key === name ? { ...field, value } : field
            )
        );
    };

    return (
        <div className="mt-4 mb-5 p-3 salary-table-responsive">
            <div className="row mb-3">
                {searchData
                    .filter((field) => field.key === "startDate" || field.key === "endDate")
                    .map((field) => (
                        <div className="col-md-2" key={field.key}>
                            <Form.Label htmlFor={field.key}>{field.label}</Form.Label>
                            <Form.Control
                                type="date"
                                id={field.key}
                                name={field.key}
                                value={field.value}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
            </div>

            {/* 직급, 부서, 이름, 조회 버튼 그룹 */}
            <div className="row align-items-end">
                {searchData
                    .filter(
                        (field) =>
                            field.key === "position" ||
                            field.key === "deptName" ||
                            field.key === "name"
                    )
                    .map((field) => (
                        <div className="col-md-2" key={field.key}>
                            <Form.Label htmlFor={field.key}>{field.label}</Form.Label>
                            {field.type === "select" ? (
                                <Form.Select
                                    id={field.key}
                                    name={field.key}
                                    value={field.value}
                                    onChange={handleChange}
                                >
                                    {field.options?.map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            ) : (
                                <Form.Control
                                    type="text"
                                    id={field.key}
                                    name={field.key}
                                    value={field.value}
                                    onChange={handleChange}
                                />
                            )}
                        </div>
                    ))}
                {/* 조회 버튼 */}
                <div className="col-md-3">
                    <button className="admin-salary-primary-btn" onClick={() => props.handleSearch(searchData)}>
                        조회
                    </button>
                </div>
            </div>
        </div>
        
    );

}


export default AdminSalarySearchPage;