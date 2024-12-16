import axios from '../axios';
import * as api from '../path';

const ATTENDANCE = api.attendancePath.ATTENDANCE;
const TODO = api.todoPath.TODO;

// 공지사항 가져오기 API
export const getAllNoticesAPI = async (page = 0, size = 5) => {
    try {
      const response = await axios.get(`/post/notices?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notices:", error);
      throw error;
    }
};

// 현재 로그인한 회원의 출/퇴근 상태 조회
export const getAttendanceAPI = async () => {
  try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${ATTENDANCE}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
  } catch (error) {
      console.error("Failed to fetch attendance:", error);
      throw error;
  }
};

// 출근 처리
export const checkInAPI = async () => {
  try {
      const token = localStorage.getItem("access_token");

      const response = await axios.post(`${ATTENDANCE}`, null, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data.data;
  } catch (error) {
      console.error("Failed to check in:", error);
      throw error;
  }
};

// 퇴근 처리
export const checkOutAPI = async (id) => {
  try {
      const token = localStorage.getItem("access_token");

      const response = await axios.put(`${ATTENDANCE}/${id}`, null, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data.data;
  } catch (error) {
      console.error("Failed to check out:", error);
      throw error;
  }
};

// 오늘 할 일
export const getTodayTodosAPI = async () => {
  try {
      const response = await axios.get(`${TODO}/today`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
      });
      return response.data.data;
  } catch (error) {
      console.error('Failed to fetch today todos:', error);
      throw error;
  }
};

// 팀 구성원 표시
export const getTeamDetailAPI = async () => {
    try {
        const response = await axios.get('/emp/team', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch team details:', error);
        throw error;
    }
};