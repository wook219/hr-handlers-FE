import axios from '../../axios.js';
import * as api from '../adminPath';

const ADMINEMPLOYEE = api.path.ADMINEMPLOYEE;

const searchEmployeeAPI = (params) => {
    return axios({
            url: ADMINEMPLOYEE.SEARCH,
            method: 'get',
            params: params,
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




export { searchEmployeeAPI };