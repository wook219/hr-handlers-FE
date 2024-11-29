import React from 'react';

const Header = ({ title }) => {
  return (
    <div>
      <div>목록으로</div>
      <div>{title}</div>
      <div>퇴장</div>
    </div>
  );
};

export default Header;
