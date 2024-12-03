import axios from '../axios'; // axios 인스턴스 가져오기
import * as api from '../path';
import { getEmpNoFromToken } from '../../utils/tokenUtils';

const VACATION = api.vacationPath.VACATION;

// 승인 대기 휴가 조회
export const getPendingVacationsAPI = async () => {
    try {
        const empNo = getEmpNoFromToken();
        const response = await axios.get(`${VACATION}/pending/${empNo}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

// 확정 휴가 조회 (승인, 반려)
export const getApprovedVacationsAPI = async () => {
    try {
        const empNo = getEmpNoFromToken();
        const response = await axios.get(`${VACATION}/approved/${empNo}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

// 차트에 들어갈 휴가 정보 조회
export const getVacationSummaryAPI = async () => {
    try {
        const empNo = getEmpNoFromToken();
        const response = await axios.get(`${VACATION}/summary/${empNo}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

// 휴가 등록
export const enrollVacationAPI = async (vacationData) => {
    try {
        const empNo = getEmpNoFromToken();
        const requestData = {
            ...vacationData,
            empNo: empNo
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
        const empNo = getEmpNoFromToken();

        const requestData = {
            ...modifyData,
            empNo: empNo
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