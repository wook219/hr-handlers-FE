import axios from '../axios'; // axios 인스턴스 가져오기
import * as api from '../path';

const TODO = api.todoPath.TODO;

// 모든 Todo 조회
export const getAllTodosAPI = async () => {
  try {
    const response = await axios.get(`${TODO}/1`); // 서버 엔드포인트: GET /todo
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
            employeeId: 1, 
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