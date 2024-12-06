import axios from '../axios'; // axios 인스턴스 가져오기
import * as api from '../path';

const TODO = api.todoPath.TODO;

// 모든 Todo 조회
export const getAllTodosAPI = async (start, end) => {
  try {
    const token = localStorage.getItem("access_token");

    // 날짜 형식을 'YYYY-MM-DD' 형식으로 변환
    const startDate = start.split('T')[0];
    const endDate = end.split('T')[0];

    const response = await axios.get(`${TODO}`, {
        params : {
            start : startDate,
            end : endDate
        },

        headers: {
            Authorization: `Bearer ${token}`, // Bearer 토큰 설정
        },
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    throw error;
  }
};

// Todo 상세 조회
export const getTodoDetailAPI = async (todoId) => {
    try {
        const response = await axios.get(`${TODO}/detail/${todoId}`);
        return response.data.data; // 서버에서 반환되는 데이터 형식에 맞게 수정
    } catch (error) {
        console.error(`Failed to fetch todo detail for ID ${todoId}:`, error);
        throw error;
    }
};

// Todo 등록
export const enrollTodoAPI = async (todoData) => {
    try {
        const response = await axios.post(`${TODO}`, {
            title: todoData.title,
            content: todoData.content,
            startTime: todoData.startTime,
            endTime: todoData.endTime
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to enroll Todo:', error);
        throw error;
    }
};

// Todo 수정
export const modifyTodoAPI = async (todoId, todoData) => {
    try {
        const response = await axios.put(`${TODO}/${todoId}`, {
            title: todoData.title,
            content: todoData.content,
            startTime: todoData.startTime,
            endTime: todoData.endTime
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to modify Todo:', error);
        throw error;
    }
};

// Todo 삭제
export const deleteTodoAPI = async (todoId) => {
    try {
        const response = await axios.delete(`${TODO}/${todoId}`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to delete Todo:', error);
        throw error;
    }
};

// 공휴일 조회
export const getHolidaysAPI = async (year, month) => {
    try {
        const response = await axios.get(`${TODO}/holidays/${year}/${month}`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch holidays:', error);
        throw error;
    }
};