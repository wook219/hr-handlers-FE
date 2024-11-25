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

// 참여 중인 채팅방 목록 조회 API
export const getAllEnterChatAPI = async () => {};

// 채팅방 생성 API
export const createChatRoomAPI = async (chatRoomTitle) => {
  try {
    const response = await axios.post('/chatroom', chatRoomTitle);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Failed to create chatRoom: ', error);
    throw error;
  }
};
