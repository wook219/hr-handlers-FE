import { API_BASE_URL } from './axios';

export const path = {
    SALARY: {
        BASE: `${API_BASE_URL}/salary`,
        EXCELDOWNLOAD: `${API_BASE_URL}/salary/excel/download`,
    },
    ADMIN_EMP: `${API_BASE_URL}/admin/emp`
}

export const todoPath = {
    TODO : `${API_BASE_URL}/todo`
}

export const vacationPath = {
    VACATION : `${API_BASE_URL}/vacation`
}

export const attendancePath = {
    ATTENDANCE : `${API_BASE_URL}/attendance`
}