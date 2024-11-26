import './App.css'; // App.js에 스타일 적용
import AppRouter from './router/Router';
import Sidebar from "./components/Sidebar/Sidebar";
import './components/Sidebar/Sidebar.css';
import { UserProvider } from "./context/UserContext";


function App() {
  return (
    <UserProvider>
      <div className="app">
        <Sidebar />
        <div className="content">
          <AppRouter />
        </div>
      </div>
    </UserProvider>
  );
}

export default App;