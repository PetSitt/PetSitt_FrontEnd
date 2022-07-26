import {api} from './api';

export const chatApis = {
	chatListGet: (id) => api.get(`/chats/chatList/${id}`),
	chatRoomGet: (roomId, socket) => api.get(`/chats/${roomId}/${socket}`),
	chatRoomPost: (sitterId) => api.post(`/chats/${sitterId}`),
	chatMessagePost: (data) => api.post('/chats/chatting', data),
};