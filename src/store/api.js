import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const localhostApi = axios.create({
	baseURL: "http://localhost:5001",
	headers: {
		'Content-type': 'application/json; charset=UTF-8',
		accept: 'application/json,',
	}
});

const api = axios.create({
	baseURL: "http://15.165.160.107",
	headers: {
		'Content-type': 'application/json; charset=UTF-8',
		accept: 'application/json,',
	}
});

api.interceptors.request.use((config)=> {
	config.headers['Authorization'] = `Bearer ${cookies.get('accessToken')}`
	return config;
}, (err) => {
	return Promise.reject(err);
});

export const apis = {
	// user
	signupAdd: (data) => api.post('/api/signup', data),
	passwordFind: (userEmail) => api.post('/user/password_check', {userEmail}),
	login: (data) => api.post('/api/login', data),

	// mypage
	myprofile: () => api.get('/mypage/myprofile'),
	petprofile: () => api.get('/mypage/petprofile'),
}