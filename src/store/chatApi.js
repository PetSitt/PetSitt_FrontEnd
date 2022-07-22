import axios from "axios";

const jsonApi = axios.create({
	baseURL: process.env.REACT_APP_SERVER
});

jsonApi.interceptors.request.use((config) => {
	config.headers['Content-type'] = 'application/json; charset=UTF-8';
	config.headers['Accept'] = 'application/json';
	config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
	return config;
}, (err) => {
	return Promise.reject(err);
});

export const chatApis = {
	chatListGet: () => jsonApi.get('/chats/chatList'),
	chatRoomGet: (roomId) => jsonApi.get(`/chats/${roomId}`),
	chatMessagePost: (data) => jsonApi.post('/chats/chatting', data)
};