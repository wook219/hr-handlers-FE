import React, { useEffect, useState } from 'react';

const SalaryPage = () => {
    const [salary, setSalary] = useState([]);

    useEffect(() => {
        // fetchCoupons();
    }, []);

    return (
        <div className="product-list card border-0">
            <h2 className="mb-4">테스트!!!!</h2>
        </div>
    );

}

export default SalaryPage;