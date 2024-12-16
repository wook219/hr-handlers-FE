import axios from '../axios'; // axios 인스턴스 가져오기
import * as api from '../path';

const ATTENDANCE = api.attendancePath.ATTENDANCE;

export const getAttendanceHistoryAPI = async (params) => {
    try {
        const token = localStorage.getItem("access_token");

        const queryParams = new URLSearchParams({
            page: params.page,
            size: params.size,
            ...(params.checkInTime && { checkInTime: params.checkInTime }),
            ...(params.checkOutTime && { checkOutTime: params.checkOutTime })
        });

        const response = await axios.get(`${ATTENDANCE}/history?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch attendance history:", error);
        throw error;
    }
};