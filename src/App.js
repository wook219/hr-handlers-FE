import './App.css'; // App.js에 스타일 적용
import AppRouter from './router/Router';
import Sidebar from "./components/Sidebar/Sidebar";
import './components/Sidebar/Sidebar.css';
import { UserProvider } from "./context/UserContext";
import { useLocation } from "react-router-dom";
import HiddenUtils from "./utils/HiddenUtils"; 

function App() {
  const location = useLocation(); 
  const isSidebarHidden = HiddenUtils.isSidebarHidden(location.pathname);

  return (
    <UserProvider>
      <div className="app">
      {!isSidebarHidden && <Sidebar />} 
        <div className={`content ${isSidebarHidden ? "full-width" : ""}`}>
          <AppRouter />
        </div>
      </div>
    </UserProvider>
  );
}

export default App;