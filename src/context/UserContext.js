import React, { createContext, useContext, useState } from "react";

// Context 생성
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 초기 상태를 localStorage에서 가져옴
  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { empNo: null, role: null, name: null, deptName: null }; // 초기값
  };

  const [user, setUser] = useState(getUserFromLocalStorage());

  // 로그인 시 사용자 정보 저장
  const login = (userData) => {
    const updatedUser = {
      empNo: userData.empNo,
      role: userData.role,
      name: userData.name,
      deptName: userData.deptName,
      profileImage: userData.profileImage,
    };
    setUser(updatedUser); // Context에 저장
    localStorage.setItem("user", JSON.stringify(updatedUser)); // localStorage에 저장 -> 새로고침 문제 해결
  };

  // 로그아웃 시 사용자 정보 초기화
  const logout = () => {
    const initialState = { empNo: null, role: null, name: null, deptName: null };
    setUser(initialState); // Context 제거
    localStorage.removeItem("user"); // localStorage 제거
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Context 커스텀 Hook
export const useUser = () => useContext(UserContext);