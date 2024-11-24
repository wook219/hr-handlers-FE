import axios from '../axios';

// 채팅방 목록 조회 API
export const getAllChatRoomAPI = async () => {
  try {
    const response = await axios.get('/chatroom');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all chatrooms:', error);
    throw error;
  }
};
