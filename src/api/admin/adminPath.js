import { API_BASE_URL } from '../axios';
const ADMIN_BASE_URL = `${API_BASE_URL}/admin`

export const path = {
    ADMINSALARY: {
        BASE: `${ADMIN_BASE_URL}/salary`,
        SEARCH: `${ADMIN_BASE_URL}/salary/search`,
        EXCELUPLOAD: `${ADMIN_BASE_URL}/salary/excel/upload`,
        EXCELDOWNLOAD: `${ADMIN_BASE_URL}/salary/excel/download`,
    },
}