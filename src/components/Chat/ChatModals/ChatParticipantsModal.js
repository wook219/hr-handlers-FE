import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import './ChatRoomModal.css';
import { getJoinedEmployees } from '../../../api/chat';
import { PersonFill } from 'react-bootstrap-icons';

const ChatParticipantsModal = ({ show, handleClose, chatRoomId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      const loadParticipants = async () => {
        try {
          setLoading(true);
          const response = await getJoinedEmployees(chatRoomId); // 채팅방 ID로 참여자 목록을 불러옴
          setParticipants(response.data);
        } catch (error) {
          setError('참여자 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };
      loadParticipants();
    }
  }, [show, chatRoomId]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <div>
            참가자 목록 <PersonFill className="chat-participant-icon" />
            <span>{participants.length}</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center chat-participant-scrollable-modal">
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div>
            {participants.map((participant, index) => (
              <div
                key={participant.empNo}
                className={`chat-participant ${index === participants.length - 1 ? 'last-participant' : ''}`}
              >
                <div className="chat-participant-empName">{participant.empName}</div>
                <div className="chat-participant-participant-details">
                  <div className="chat-participant-deptName">{participant.deptName || ''}</div>
                  <div className="chat-participant-empPosition">{participant.empPosition}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ChatParticipantsModal;
