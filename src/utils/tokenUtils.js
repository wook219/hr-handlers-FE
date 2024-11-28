export const getEmpNoFromToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.empNo;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};