import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUser] = useState({
    name: "",
    team: "",
  });

  return (
    <UserContext.Provider value={{ userInfo, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Context 소비자 (Consumer) Hook
export function useUser() {
    return useContext(UserContext);
  }