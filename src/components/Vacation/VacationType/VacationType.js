import React, { useState } from 'react';
import VacationEnrollModal from '../Modal/VacationEnrollModal';
import './VacationType.css';

const VacationType = ({ icon: Icon, title, type, remainingDays, onVacationUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);

    const handleModalClose = async (response) => {
        setShowModal(false);
        if (response) {
            // API 응답 데이터를 직접 사용하여 화면 업데이트
            onVacationUpdate(response.data);
        }
    };

    return (
        <>
            <div className="vacation-type-item" onClick={() => setShowModal(true)}>
                <div className="vacation-type-content">
                    <Icon className="vacation-type-icon" />
                    <h3 className="vacation-type-title">{title}</h3>
                </div>
            </div>

            {showModal && (
                <VacationEnrollModal
                    type={type}
                    remainingDays={remainingDays}
                    onClose={handleModalClose}
                />
            )}

            {error && <div className="error-message">{error}</div>}
        </>
    );
};

export default VacationType;