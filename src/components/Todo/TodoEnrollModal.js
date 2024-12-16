import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

const TodoEnrollModal = ({ isOpen, onClose, onSubmit }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startTime: '',
    endTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);  

    if (endTime < startTime) {
      showToast('종료시간이 시작시간보다 빠를 수 없습니다.', 'error');
      return;
    }

    // 시간대 조정을 위한 데이터 변환
    const adjustedFormData = {
      ...formData,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    };

    onSubmit(adjustedFormData);
    setFormData({ title: '', content: '', startTime: '', endTime: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="todo-modal-overlay">
      <div className="todo-modal-content">
        <h2>일정 등록</h2>
        <form onSubmit={handleSubmit}>
          <div className="todo-modal-field">
            <label className="required">시작 시간</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
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
              maxLength={30}
              required
            />
          </div>

          <div className="todo-modal-field">
            <label>내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              maxLength={200}
            />
          </div>

          <div className="todo-modal-actions">
            <button type="submit" className='todo-enroll'>등록</button>
            <button type="button" className='todo-cancel' onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoEnrollModal;