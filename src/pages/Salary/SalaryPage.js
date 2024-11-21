import React, { useEffect, useState } from 'react';
import { getSalaryAPI } from '../../api/index.js';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

const SalaryPage = () => {
    const [salaries, setSalaries] = useState([]);

    useEffect(() => {

        const getSalaries = async () => {
            const { response, error } = await getSalaryAPI();
            console.log("response : ", response);
            if (error) {
                console.log('에러 발생');
                return;
            }
            setSalaries(response.data.data);
        };
        getSalaries()
    }, []);

    const showModal = () => {
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
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );

}

export default SalaryPage;