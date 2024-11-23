import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // App.js에 스타일 적용
import AppRouter from './router/Router';
import Sidebar from "./components/Sidebar/Sidebar";
import './components/Sidebar/Sidebar.css';
import { UserProvider } from "./context/UserContext";


function App() {
  const [hidata, setHello] = useState('')
 
  useEffect(() => {
    axios.get('/api/hello')
      .then(response => setHello(response.data))
      .catch(error => console.log(error))
  }, []);
 
  return (
    <UserProvider>
      <div className="app">
        <Sidebar />
        <div className="content">
          백엔드 스프링 부트 데이터 : {hidata}
          <AppRouter />
        </div>
      </div>
    </UserProvider>
  );
}

export default App;