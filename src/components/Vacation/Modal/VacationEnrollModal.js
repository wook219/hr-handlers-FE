import React, { useState } from 'react';
import { Tent, Clock, Pill, Building, X } from 'lucide-react';
import { enrollVacationAPI } from '../../../api/vacation';
import { useToast } from '../../../context/ToastContext';
import './VacationModal.css';

const VacationEnrollModal = ({ type, remainingDays, onClose }) => {

    const [formData, setFormData] = useState({
        title: '',
        type: type,
        startDate: '',
        endDate: '',
        reason: '',
        halfDayType: 'MORNING' // 반차 선택 시 기본값
    });

    // 휴가 타입별 설정
    const vacationTypeConfig = {
        ANNUAL: {
            icon: <Tent size={24} />,  // 컴포넌트로 직접 렌더링
            title: '연차',
            tags: ['1년당 15개 사용가능', '유급', '연말만료']
        },
        HALF: {
            icon: <Clock size={24} />,
            title: '반차',
            tags: ['0.5일 차감', '유급', '연말 만료']
        },
        SICK: {
            icon: <Pill size={24} />,
            title: '병가',
            tags: ['1일 차감', '유급']
        },
        PUBLIC: {
            icon: <Building size={24} />,
            title: '공가',
            tags: ['0일 차감', '유급']
        }
    };
    const { showToast } = useToast();
    const currentConfig = vacationTypeConfig[type];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        
        if (endDate < startDate) {
            showToast('종료일이 시작일보다 빠를 수 없습니다.', 'error');
            return;
        }

        try {
            const requestData = {
                ...formData,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            };

            const response = await enrollVacationAPI(requestData);
            onClose(response);
            showToast('휴가 신청이 완료되었습니다.', 'success');
        } catch (error) {
            console.error('휴가 신청 실패:', error);
            if (error.message === '잔여 휴가 일수가 부족합니다.') {
                showToast('잔여 휴가 일수가 부족합니다.', 'error');
            }else {
                showToast('휴가 신청에 실패했습니다.', 'error');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="vacation-modal-overlay">
            <div className="vacation-modal-content">
                
                
                <div className="vacation-modal-header">
                    {currentConfig.icon}
                    <h2 className='vacation-type'>{currentConfig.title}</h2>

                    <button 
                        className="vacation-modal-close" 
                        onClick={() => onClose(false)}>
                        ×
                    </button>
                </div>

                <div className="vacation-info-section">
                    {currentConfig.tags.map((tag, index) => (
                        <span key={index} className="vacation-info-tag">{tag}</span>
                    ))}
                    
                    {type !== 'PUBLIC' && (
                        <div className="vacation-remain-days">
                            💡 사용 가능 휴가
                            <span className="days">{remainingDays}일</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="vacation-form-group">
                        <label>제목</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="휴가 제목을 입력하세요"
                            className="vacation-form-input"
                            required
                        />
                    </div>

                    {type === 'HALF' && (
                        <div className="vacation-form-group">
                            <label>반차 선택</label>
                            <select
                                name="halfDayType"
                                value={formData.halfDayType}
                                onChange={handleChange}
                                className="vacation-form-input"
                            >
                                <option value="MORNING">오전</option>
                                <option value="AFTERNOON">오후</option>
                            </select>
                        </div>
                    )}

                    <div className="vacation-form-group">
                        <label>휴가 일정</label>
                        <div className="vacation-date-inputs">
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="vacation-form-input"
                                required
                            />
                            {type !== 'HALF_DAY' && (
                                <>
                                    <span>~</span>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="vacation-form-input"
                                        required
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="vacation-form-group">
                        <label>휴가 사유</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="휴가 사유를 입력하세요"
                            className="vacation-form-textarea"
                            required
                        />
                    </div>

                    <div className="vacation-button-group">
                        
                        <button type="submit" className="vacation-submit-button">
                            휴가신청
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VacationEnrollModal;