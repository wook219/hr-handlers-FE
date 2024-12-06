import axios from '../../axios.js';
import { path } from '../adminPath';

export const getAdminVacationsAPI = async () => {
    try {
        const response = await axios.get(path.ADMINVACATION.BASE);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const approveVacationAPI = async (id) => {
    try {
        const response = await axios.put(path.ADMINVACATION.APPROVE(id));
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const rejectVacationAPI = async (id) => {
    const token = localStorage.getItem("access_token");

    try {
        const response = await axios.put(path.ADMINVACATION.REJECT(id));
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const getVacationStatusAPI = async () => {
    try {
        const response = await axios.get(path.ADMINVACATION.STATUS);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};