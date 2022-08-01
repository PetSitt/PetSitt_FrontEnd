import {api} from './api';

export const chatApis = {
	chatListGet: () => api.get('/chats/chatList/'),
	chatRoomGet: (roomId, socket) => api.get(`/chats/${roomId}/${socket}`),
	chatRoomPost: (sitterId) => api.post(`/chats/${sitterId}`),
	chatMessagePost: (data) => api.post('/chats/chatting', data),
	checkNewMessage: () => api.get('/informations/newcheck'),
};