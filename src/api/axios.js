import axios from 'axios';

// Axios 기본 설정 (예: 기본 URL 설정)
const instance = axios.create({
    baseURL: 'http://localhost:8080', // API의 기본 URL
    timeout: 5000, // 요청 제한 시간
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 (토큰 추가 등)
instance.interceptors.request.use(config => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 응답 인터셉터 (에러 처리 등)
instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        // 인증 에러 처리 (로그아웃 등)
    }
    return Promise.reject(error);
});

export default instance;