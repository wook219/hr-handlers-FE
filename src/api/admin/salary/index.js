import axios from '../../axios.js';
import * as api from '../adminPath';

const ADMINSALARY = api.path.ADMINSALARY;

const getAllSalaryAPI = () => {
    return axios({
            url: ADMINSALARY,
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

const createSalaryAPI = (params) => {
    return axios({
            url: ADMINSALARY,
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


export { getAllSalaryAPI, createSalaryAPI };