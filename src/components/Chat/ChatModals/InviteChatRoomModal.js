import React, { useEffect, useRef, useState } from 'react';
import { Form, InputGroup, Modal } from 'react-bootstrap';
import { XCircle } from 'react-bootstrap-icons';
import './ChatRoomModal.css';
import InviteChatRoomButton from '../ChatButtons/InviteChatRoomButton';
import { getInvitedEmployeesAPI } from '../../../api/chat';

const InviteChatRoomModal = ({ show, handleClose, chatRoomId, onInviteSuccess }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [employeeList, setEmployeeList] = useState([]);

  const fetchEmployees = async (search = '') => {
    try {
      const response = await getInvitedEmployeesAPI(chatRoomId, search);
      setEmployeeList(response.data);
    } catch (error) {
      console.error('직원 목록 가져오기를 실패했습니다.', error);
    }
  };

  // 모달이 열릴 때 직원 목록을 가지고 옴
  useEffect(() => {
    if (show) {
      fetchEmployees();
    }
  }, [show, chatRoomId]);

  // 모달을 닫을 때 검색어 초기화
  useEffect(() => {
    if (!show) {
      setSearchKeyword('');
    }
  }, [show]);

  // 검색 키워드 변경 시
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 처리 함수(엔터 처리)
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchEmployees(searchKeyword);
    }
  };

  // x 버튼을 누르면 검색어 초기화가 되도록
  const clearSearch = () => {
    setSearchKeyword('');
    fetchEmployees(); // 초기 목록 불러오기
  };

  // 초대 후 참여자 목록 갱신
  const handleInviteSuccess = (empNo) => {
    // 초대 후 부모 컴포넌트의 함수 호출
    onInviteSuccess();
  };

  // 검색 결과가 없을 때와 초대할 직원이 없을 때 구분
  const isSearchEmpty = searchKeyword && employeeList.length === 0;
  const isEmployeeListEmpty = employeeList.length === 0;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <div>초대하기</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="chat-participant-scrollable-modal">
        {/* 검색어 입력 */}
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyPress}
            placeholder="사원 검색"
          />
          <InputGroup.Text className="chat-invite-clear" onClick={clearSearch}>
            <XCircle />
          </InputGroup.Text>
        </InputGroup>

        {/* 검색 결과가 없는 경우 */}
        {isSearchEmpty && <div>검색 결과가 없습니다.</div>}

        {/* 초대할 직원이 없을 때 */}
        {!isSearchEmpty && isEmployeeListEmpty && <div>모든 사원이 현재 채팅방에 참여 중입니다.</div>}

        {/* 직원 목록 */}
        <div>
          {employeeList.map((employee) => (
            <div key={employee.empNo} className="chat-employee-item">
              <div className="chat-employee-info">
                <div className="chat-employee-name">{employee.empName}</div>
                <div className="chat-employee-details">
                  <div className="chat-employee-dept">{employee.deptName}</div>
                  <div className="chat-employee-position">{employee.empPosition}</div>
                </div>
              </div>

              <div className="chat-employee-button-container">
                <InviteChatRoomButton
                  chatRoomId={chatRoomId}
                  empNo={employee.empNo}
                  onInvite={() => handleInviteSuccess(employee.empNo)}
                />
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default InviteChatRoomModal;
