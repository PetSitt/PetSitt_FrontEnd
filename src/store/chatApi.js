import {api} from './api';

export const chatApis = {
	chatListGet: () => api.get('/chats/chatList'),
	chatRoomGet: (roomId) => api.get(`/chats/${roomId}`),
	chatRoomPost: function (sitterId) {
		console.log(`/chats/${sitterId}`)
		api.post(`/chats/${sitterId}`)},
	chatMessagePost: (data) => api.post('/chats/chatting', data)
};