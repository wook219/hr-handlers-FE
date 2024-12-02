import axios from '../../axios.js';
import * as api from '../adminPath';

const ADMINSALARY = api.path.ADMINSALARY;

const getAllSalaryAPI = () => {
    return axios({
            url: ADMINSALARY.BASE,
            method: 'get'
        })
        .then(res => {
            if (!res.data) {
                throw new Error("응답 에러: 데이터가 없습니다.");
            }
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

const searchSalaryAPI = (params, page, size) => {
    return axios({
            url: `${ADMINSALARY.SEARCH}?page=${page}&size=${size}`,
            method: 'post',
            data: params
        })
        .then(res => {
            if (!res.data) {
                throw new Error("응답 에러: 데이터가 없습니다.");
            }
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

const createSalaryAPI = (params) => {
    return axios({
            url: ADMINSALARY.BASE,
            method: 'post',
            data: params
        })
        .then(res => {
            if (!res.data) {
                throw new Error("응답 에러: 데이터가 없습니다.");
            }
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

const updateSalaryAPI = (params) => {
    return axios({
            url: ADMINSALARY.BASE,
            method: 'put',
            data: params
        })
        .then(res => {
            if (!res.data) {
                throw new Error("응답 에러: 데이터가 없습니다.");
            }
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

const deleteSalaryAPI = (params) => {
    return axios({
            url: ADMINSALARY.BASE,
            method: 'delete',
            data: params
        })
        .then(res => {
            if (!res.data) {
                throw new Error("응답 에러: 데이터가 없습니다.");
            }
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

const excelUploadSalaryAPI = (formData) => {
    return axios({
            url: ADMINSALARY.EXCELUPLOAD,
            method: 'post',
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data", // 파일 업로드를 위해 반드시 필요
            },
        })
        .then(res => {
            if (!res.data) {
                throw new Error("응답 에러: 데이터가 없습니다.");
            }
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

const excelDownloadSalaryAPI = (params) => {
    return axios({
            url: ADMINSALARY.EXCELDOWNLOAD,
            method: 'post',
            data: params,
            responseType: 'blob'
        })
        .then(res => {
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};


export { getAllSalaryAPI, searchSalaryAPI, createSalaryAPI, updateSalaryAPI, deleteSalaryAPI, excelUploadSalaryAPI, excelDownloadSalaryAPI };