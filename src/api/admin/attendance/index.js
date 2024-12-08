import axios from '../../axios.js';
import { path } from '../adminPath';

export const getAdminAttendanceAPI = async (params) => {
    try {
        const queryParams = new URLSearchParams({
            page: params.page,
            size: params.size,
        });

        if (params.checkInTime) queryParams.append('checkInTime', params.checkInTime);
        if (params.checkOutTime) queryParams.append('checkOutTime', params.checkOutTime);
        if (params.department) queryParams.append('deptName', params.department);
        if (params.position) queryParams.append('position', params.position);
        if (params.employeeName) queryParams.append('name', params.employeeName);

        const response = await axios.get(`${path.ADMINATTENDENCE.BASE}?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch admin attendance:', error);
        throw error;
    }
};