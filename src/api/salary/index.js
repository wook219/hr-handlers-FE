import axios from '../axios.js';
import * as api from '../path';

const SALARY = api.path.SALARY;

const getSalaryAPI = (page, size) => {
    return axios({
            url: `${SALARY.BASE}?page=${page}&size=${size}`,
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

const excelDownloadSalaryAPI = (params) => {
    return axios({
            url: SALARY.EXCELDOWNLOAD,
            method: 'post',
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


export { getSalaryAPI, excelDownloadSalaryAPI };