import React, { createContext, useContext, useState } from "react";

// Context 생성
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 전역 상태로 관리할 사용자 정보 초기 값 설정
  const [user, setUser] = useState({
    empNo: null,      // 사원 번호
    role: null,       // 권한
    name: null,       // 이름
    deptName: null, // 부서 이름
  });

  // 로그인: 사용자 정보를 Context에 저장
  const login = (userData) => {
    setUser({
      empNo: userData.empNo,         
      role: userData.role,           
      name: userData.name,            
      deptName: userData.deptName 
    });
  };

  // 로그아웃: 사용자 정보 초기화
  const logout = () => {
    setUser({
      empNo: null,
      role: null,
      name: null,
      deptName: null
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Context 커스텀 Hook
export const useUser = () => useContext(UserContext);