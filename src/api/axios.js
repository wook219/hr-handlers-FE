import axios from 'axios';

// Axios 기본 설정 
const instance = axios.create({
    baseURL: 'http://localhost:8080', 
    timeout: 5000, // 요청 제한 시간
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 요청 인터셉터 
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
         config.headers['access'] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 응답 인터셉터
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const reissueResponse = await axios.post('http://localhost:8080/reissue', null, {
                    withCredentials: true,
                });

                const newAccessToken = reissueResponse.headers['access'];
                if (newAccessToken) {
                    localStorage.setItem('access_token', newAccessToken);

                    originalRequest.headers['access'] = newAccessToken;

                    return instance(originalRequest);
                }
            } catch (reissueError) {
                console.error('Access Token 재발급 실패:', reissueError);
                localStorage.removeItem('access_token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default instance;