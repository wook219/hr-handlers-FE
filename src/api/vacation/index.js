import axios from '../axios'; // axios 인스턴스 가져오기
import * as api from '../path';

const VACATION = api.vacationPath.VACATION;

// 승인 대기 휴가 조회
export const getPendingVacationsAPI = async () => {
    try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`${VACATION}/pending`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

// 확정 휴가 조회 (승인, 반려)
export const getApprovedVacationsAPI = async (page) => {
    const token = localStorage.getItem("access_token");

    try {
        const response = await axios.get(`${VACATION}/approved`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page: page,
                size: 4
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

// 차트에 들어갈 휴가 정보 조회
export const getVacationSummaryAPI = async () => {
    try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`${VACATION}/summary`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

// 휴가 등록
export const enrollVacationAPI = async (vacationData) => {
    try {
        const requestData = {
            ...vacationData
        };

        const response = await axios.post(`${VACATION}`, requestData);
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message === '잔여 휴가 일수가 부족합니다.') {
            throw new Error('잔여 휴가 일수가 부족합니다.');
        }
        throw error;
    }
};

// 휴가 상세 조회
export const getVacationDetailAPI = async (id) => {
    try {
        const response = await axios.get(`${VACATION}/${id}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// 휴가 수정
export const modifyVacationAPI = async (id, modifyData) => {
    try {
        const requestData = {
            ...modifyData,
        };

        const response = await axios.put(`${VACATION}/${id}`, requestData);

        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// 휴가 삭제
export const deleteVacationAPI = async (id) => {
    try {
        const response = await axios.delete(`${VACATION}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};