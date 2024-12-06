import './App.css'; // App.js에 스타일 적용
import AppRouter from './router/Router';
import Sidebar from "./components/Sidebar/Sidebar";
import './components/Sidebar/Sidebar.css';
import { UserProvider } from "./context/UserContext";
import { ToastProvider } from "./context/ToastContext";
import { useLocation } from "react-router-dom";
import HiddenUtils from "./utils/HiddenUtils"; 

function App() {
  const location = useLocation(); 
  const isSidebarHidden = HiddenUtils.isSidebarHidden(location.pathname);

  return (
    <UserProvider>
      <ToastProvider>
        <div className="app">
        {!isSidebarHidden && <Sidebar />} 
          <div className={`content ${isSidebarHidden ? "full-width" : ""}`}>
            <AppRouter />
          </div>
        </div>
      </ToastProvider>
    </UserProvider>
  );
}

export default App;