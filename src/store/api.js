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
	baseURL: "http://3.35.220.155",
	headers: {
		'Content-type': 'application/json; charset=UTF-8',
		accept: 'application/json,',
	} 
});

const mainApi = axios.create({
	baseURL: "http://3.35.19.186:3000",
	headers: {
		'Content-type': 'application/json; charset=UTF-8',
		accept: 'application/json,',
	}
})

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
	myprofileGet: () => api.get('/mypage/myprofile'),
	myprofilePatch: (data) => api.patch('/mypage/myprofile', data),
	petprofileGet: () => api.get('/mypage/petprofile'),
  
	// main
	getSittersList: (date, region, category) => mainApi.get('/mains/search', {params: {searchDate: date, region_2depth_name: region, dayCare: category}})
  
}
