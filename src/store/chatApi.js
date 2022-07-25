import {api} from './api';

export const chatApis = {
	chatListGet: () => api.get('/chats/chatList'),
	chatRoomGet: (roomId) => api.get(`/chats/${roomId}`),
	chatMessagePost: (data) => api.post('/chats/chatting', data)
};