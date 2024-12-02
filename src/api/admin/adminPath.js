export const API_BASE_URL = 'http://localhost:8080/admin';

export const path = {
    ADMINSALARY: {
        BASE: `${API_BASE_URL}/salary`,
        SEARCH: `${API_BASE_URL}/salary/search`,
        EXCELUPLOAD: `${API_BASE_URL}/salary/excel/upload`,
        EXCELDOWNLOAD: `${API_BASE_URL}/salary/excel/download`,
    },
}