import React from 'react';
import './VacationStatus.css';

const VacationTable = ({ headers, data, rowRenderer, type = 'default' }) => {
    const safeData = data || [];
    
    return (
        <div className="vacation-table-container">
            <table className={`vacation-table ${type}`}>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {safeData.map((item, index) => rowRenderer(item, index))}
                    {safeData.length === 0 && (
                        <tr>
                            <td colSpan={headers.length} style={{ textAlign: 'center' }}>
                                데이터가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VacationTable;