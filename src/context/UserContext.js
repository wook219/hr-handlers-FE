import React, { createContext, useContext, useState } from "react";

// Context 생성
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 초기 상태를 localStorage에서 가져옴
  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    console.log("user 정보"+storedUser)
    return storedUser ? JSON.parse(storedUser) : { empNo: null, role: null, name: null, deptName: null };
  };

  const [user, setUser] = useState(getUserFromLocalStorage());

  // 로그인: 사용자 정보를 Context와 localStorage에 저장
  const login = (userData) => {
    
    const updatedUser = {
      empNo: userData.empNo,
      role: userData.role,
      name: userData.name,
      deptName: userData.deptName,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // 로그아웃: 사용자 정보를 초기화하고 localStorage에서 제거
  const logout = () => {
    const initialState = { empNo: null, role: null, name: null, deptName: null };
    setUser(initialState);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Context 커스텀 Hook
export const useUser = () => useContext(UserContext);