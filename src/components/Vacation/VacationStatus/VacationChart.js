import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './VacationStatus.css';

const VacationChart = ({summaryData}) => {
    const chartData = [
        { name: '잔여', value: summaryData.remaining },
        { name: '사용', value: summaryData.used },
        { name: '승인대기', value: summaryData.pending }
    ];

    const COLORS = ['#98E9D0', '#FFB6A3', '#FFE5CC'];

    return (
        <div className="vacation-chart-section">
            <div style={{ width: 250, height: 250 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            innerRadius={85}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="vacation-chart-labels">
                <div className="vacation-chart-label">
                    <div className="vacation-chart-color vacation-chart-color-remain"></div>
                    <span>잔여 {summaryData.remaining}</span>
                </div>
                <div className="vacation-chart-label">
                    <div className="vacation-chart-color vacation-chart-color-used"></div>
                    <span>사용 {summaryData.used}</span>
                </div>
                <div className="vacation-chart-label">
                    <div className="vacation-chart-color vacation-chart-color-waiting"></div>
                    <span>승인대기 {summaryData.pending}</span>
                </div>
            </div>
        </div>
    );
};

export default VacationChart;