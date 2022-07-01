import axios from "axios";

const localhostApi = axios.create({
	baseURL: "http://localhost:5001/",
	headers: {
		'Content-type': 'application/json; charset=UTF-8',
		accept: 'application/json,',
	}
});

const api = axios.create({
	baseURL: "http://3.35.135.160/",
	headers: {
		'Content-type': 'application/json; charset=UTF-8',
		accept: 'application/json,',
	}
});

api.interceptors.request.use((config)=> {
	config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
	return config;
}, (err) => {
	return Promise.reject(err);
});

export const apis = {
	//user
	signupAdd: (data) => api.post('/api/signup', data),
	passwordFind: (userEmail) => api.post('/user/password_check', {userEmail}),
}