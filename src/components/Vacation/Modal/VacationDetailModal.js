import React, { useState, useEffect } from 'react';
import { X, Tent, Clock, Pill, Building } from 'lucide-react';
import './VacationModal.css'; 
import { useToast } from '../../../context/ToastContext';
import { getVacationDetailAPI, modifyVacationAPI, deleteVacationAPI } from '../../../api/vacation';


const VacationDetailModal = ({ vacationId, onClose, editable, onModify, onDelete }) => {
    const [vacationDetail, setVacationDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchVacationDetail = async () => {
            try {
                setLoading(true);
                const data = await getVacationDetailAPI(vacationId);
                setVacationDetail(data);
                setEditData(data); // 수정용 데이터 초기화
            } catch (err) {
                showToast('휴가 상세 정보를 불러오는데 실패했습니다.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchVacationDetail();
    }, [vacationId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        // 날짜 유효성 검사
        const startDate = new Date(editData.startDate);
        const endDate = new Date(editData.endDate);
        
        if (endDate < startDate) {
            showToast('종료일이 시작일보다 빠를 수 없습니다.', 'error');
            return;
        }
        
        try {
            await modifyVacationAPI(vacationId, editData);
            setVacationDetail(editData);
            setIsEditMode(false);
            onModify();
            showToast('휴가가 수정되었습니다.', 'success')
        } catch (error) {
            console.error('휴가 수정 실패:', error);
            showToast('휴가 수정에 실패했습니다.', 'error');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await deleteVacationAPI(vacationId);
                showToast('휴가가 삭제되었습니다.', 'success');
                onDelete(); // 목록 새로고침을 위한 콜백
                onClose();
            } catch (error) {
                console.error('휴가 삭제 실패:', error);
                showToast('휴가 삭제에 실패했습니다.', 'error')
            }
        }
    };

    const vacationTypeConfig = {
        ANNUAL: {
            icon: <Tent size={24} />,
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

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;
    if (!vacationDetail) return null; // 데이터가 없을 때 처리

    const currentConfig = vacationTypeConfig[vacationDetail.type];

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="vacation-modal-overlay">
            <div className="vacation-modal-content">
                
                
                <div className="vacation-modal-header">
                    {currentConfig.icon}
                    <h2>{currentConfig.title} 상세 정보</h2>

                    <button 
                        className="vacation-modal-close" 
                        onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="vacation-info-section">
                    {currentConfig.tags.map((tag, index) => (
                        <span key={index} className="vacation-info-tag">{tag}</span>
                    ))}
                    <div className="vacation-info-tag">
                        문서번호: {vacationDetail.docNum}
                    </div>
                </div>

                <div className="vacation-form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        name="title"
                        className="vacation-form-input"
                        value={isEditMode ? editData.title : vacationDetail.title}
                        onChange={handleChange}
                        readOnly={!isEditMode}
                    />
                </div>

                <div className="vacation-form-group">
                    <label>휴가 일정</label>
                    <div className="vacation-date-inputs">
                        <input
                            type={isEditMode ? "date" : "text"}
                            name="startDate"
                            className="vacation-form-input"
                            value={isEditMode ? 
                                editData.startDate.split('T')[0] : 
                                formatDate(vacationDetail.startDate)}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                        <span>~</span>
                        <input
                            type={isEditMode ? "date" : "text"}
                            name="endDate"
                            className="vacation-form-input"
                            value={isEditMode ? 
                                editData.endDate.split('T')[0] : 
                                formatDate(vacationDetail.endDate)}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                </div>

                <div className="vacation-form-group">
                    <label>휴가 사유</label>
                    <textarea
                        name="reason"
                        className="vacation-form-textarea"
                        value={isEditMode ? editData.reason : vacationDetail.reason}
                        onChange={handleChange}
                        readOnly={!isEditMode}
                    />
                </div>

                <div className="vacation-button-group">
                    {editable && !isEditMode && (
                        <>
                            <button 
                                className="vacation-edit-button"
                                onClick={() => setIsEditMode(true)}
                            >
                                수정
                            </button>
                            <button 
                                className="vacation-delete-button"
                                onClick={handleDelete}
                            >
                                삭제
                            </button>
                        </>
                    )}
                    {isEditMode && (
                        <>
                            <button 
                                className="vacation-submit-button"
                                onClick={handleSubmit}
                            >
                                저장
                            </button>
                            <button 
                                className="vacation-cancel-button"
                                onClick={() => setIsEditMode(false)}
                            >
                                취소
                            </button>
                        </>
                    )}
                    
                </div>
            </div>
        </div>
    );
};

export default VacationDetailModal;