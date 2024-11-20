import React, { useEffect, useState } from 'react';
import { getSalaryAPI } from '../../api/index.js';

const SalaryPage = () => {
    const [salary, setSalary] = useState([]);

    useEffect(async () => {
        const data = await getSalaryAPI();
        console.log("data : " , data);
    }, []);

    return (
        <div className="">
            <h2 className="">급여 목록</h2>
                <div>
                    <table className="">
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
                            <tr>
                                <td>123</td>
                                <td>123</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>
    );

}

export default SalaryPage;