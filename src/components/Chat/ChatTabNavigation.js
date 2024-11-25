import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ChatTabNavigation.css';
import CreateChatRoomButton from './CreateChatRoomButton';

const TabNavigation = () => {
  const location = useLocation(); // 현재 URL 경로

  return (
    <div>
      <div className="create-chatroom-container">
        <CreateChatRoomButton />
      </div>
      <div className="tabs-container">
        <div className="tabs-header">
          <div className="tabs">
            <Link
              to="/chatroom"
              className={`tab ${location.pathname === '/chatroom' ? 'active' : ''}`} // 조건부로 active 클래스를 추가
            >
              메신저 목록
            </Link>
            <Link
              to="/chat"
              className={`tab ${location.pathname === '/chat' ? 'active' : ''}`} // 조건부로 active 클래스를 추가
            >
              참여 중인 메신저
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
