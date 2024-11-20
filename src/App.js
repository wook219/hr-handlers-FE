import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppRouter from './router/Router';

function App() {
  const [hidata, setHello] = useState('')
 
  useEffect(() => {
    axios.get('/api/hello')
      .then(response => setHello(response.data))
      .catch(error => console.log(error))
  }, []);
 
  return (
    <div className="app">
      백엔드 스프링 부트 데이터 : {hidata}
      <div className='content'>
        <AppRouter/>
      </div>
    </div>
  );
}
 
export default App;