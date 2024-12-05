import React, { useState } from 'react';
import './InviteChatRoomButton.css';
import { getInvitedEmployees } from '../../../api/chat';

const InviteChatRoomButton = ({ chatRoomId, empNo, onInvite }) => {
  const [loading, setLoading] = useState(false);

  const handleInviteClick = async () => {
    setLoading(true);
    try {
      await getInvitedEmployees(chatRoomId, empNo);
      onInvite();
    } catch (error) {
      console.error('초대 실패', error);
    }
  };

  return (
    <button className={`chat-invite-button ${loading ? 'loading' : ''}`} disabled={loading} onClick={handleInviteClick}>
      {loading ? '···' : '초대'}
    </button>
  );
};

export default InviteChatRoomButton;
