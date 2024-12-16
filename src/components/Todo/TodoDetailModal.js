import React, { useState, useEffect } from 'react';
import './TodoModal.css'
import { useToast } from '../../context/ToastContext';

const TodoDetailModal = ({ isOpen, onClose, event, onDelete, onModify }) => {
  const { showToast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startTime: '',
    endTime: ''
  });


  // Timestamp를 datetime-local 입력에 맞는 형식으로 변환하는 함수
  const formatDateForInput = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    
    // 한국 시간대로 변환 (YYYY-MM-DDThh:mm)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // 서버로 보내기 전에 날짜를 Timestamp 형식으로 변환
  const formatDateForServer = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toISOString();
  };

  useEffect(() => {
    if (event) {
      const initialData = {
        title: event.title || '',
        content: event.content || '',
        startTime: formatDateForInput(event.startTime) || '',
        endTime: formatDateForInput(event.endTime) || ''
      };
      setFormData(initialData);
      setIsDataChanged(false);
    }
  }, [event]);

  // 수정 이벤트 발생 시
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDataChanged(true);
  };

  // 수정 모드 submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 종료 시간이 시작 시간보다 이전인지 체크
    if (new Date(formData.endTime) < new Date(formData.startTime)) {
      showToast('종료 시간은 시작 시간보다 이후여야 합니다.', 'error');
      return;
    }

    const submissionData = {
      ...formData,
      startTime: formatDateForServer(formData.startTime),
      endTime: formatDateForServer(formData.endTime)
    };
    onModify(event.id, submissionData);
    setIsEditMode(false);
    setIsDataChanged(false);
  };

  // 수정 버튼 클릭
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  // 조회 모드일 떄의 닫기 버튼
  const handleCancel = () => {
    if (isDataChanged) {
      const confirm = window.confirm('변경된 내용이 있습니다. 취소하시겠습니까?');
      if (!confirm) return;
    }
    setIsEditMode(false);
    setIsDataChanged(false);
    if (event) {
      setFormData({
        title: event.title || '',
        content: event.content || '',
        startTime: formatDateForInput(event.startTime) || '',
        endTime: formatDateForInput(event.endTime) || ''
      });
    }
  };

  // 수정 모드일 때의 취소 버튼
  const handleClose = () => {
    if (isEditMode && isDataChanged) {
      const confirm = window.confirm('수정 중인 내용이 있습니다. 정말 닫으시겠습니까?');
      if (!confirm) return;
    }
    setIsEditMode(false);
    setIsDataChanged(false);
    onClose();
  };

  // 삭제 버튼 클릭
  const handleDelete = () => {
    onDelete();
  };

  if (!isOpen) return null;

  return (
    <div className="todo-modal-overlay">
      <div className={`todo-modal-content ${isEditMode ? 'edit-mode' : ''}`}>
        <div className="todo-modal-header">
          <h2>
            일정 {isEditMode ? '수정' : '상세'}
            {isEditMode && <span className="edit-badge">수정 중</span>}
          </h2>
          <button 
            type="button" 
            className="todo-modal-close" 
            onClick={handleClose}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="todo-modal-field">
            <label className="required">시작 시간</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              disabled={!isEditMode}
              required
            />
          </div>

          <div className="todo-modal-field">
            <label className="required">종료 시간</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              disabled={!isEditMode}
              required
            />
          </div>

          <div className="todo-modal-field">
            <label className="required">제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={!isEditMode}
              maxLength={30}
              required
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="todo-modal-field">
            <label>내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              disabled={!isEditMode}
              rows={4}
              maxLength={200}
              placeholder="내용을 입력하세요"
            />
          </div>

          <div className="todo-modal-actions">
            {isEditMode ? (
              <>
                <button 
                  type="submit" 
                  disabled={!isDataChanged}
                  className={!isDataChanged ? 'disabled' : ''}
                >
                  저장
                </button>
                <button type="button" onClick={handleCancel}>취소</button>
              </>
            ) : (
              <>
                <button type="button" onClick={handleEditClick}>수정</button>
                <button 
                    type="button" 
                    onClick={handleDelete}
                    className="delete-button"
                    >
                    삭제
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoDetailModal;
