import { API_BASE_URL } from '../axios';
const ADMIN_BASE_URL = `${API_BASE_URL}/admin`

export const path = {
    ADMINSALARY: {
        BASE: `${ADMIN_BASE_URL}/salary`,
        SEARCH: `${ADMIN_BASE_URL}/salary/search`,
        EXCELUPLOAD: `${ADMIN_BASE_URL}/salary/excel/upload`,
        EXCELDOWNLOAD: `${ADMIN_BASE_URL}/salary/excel/download`,
    },
    ADMINEMPLOYEE: {
        SEARCH: `${ADMIN_BASE_URL}/emp/search`
    },
    ADMINVACATION : {
        BASE: `${ADMIN_BASE_URL}/vacation`,
        STATUS : `${ADMIN_BASE_URL}/vacation/status`,
        APPROVE: (id) => `${ADMIN_BASE_URL}/vacation/${id}/approve`,
        REJECT: (id) => `${ADMIN_BASE_URL}/vacation/${id}/reject`
    },
    ADMINATTENDENCE : {
        BASE: `${ADMIN_BASE_URL}/attendance`,
    }
}