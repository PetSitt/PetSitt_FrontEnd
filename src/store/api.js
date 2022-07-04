import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const api = axios.create({
	baseURL: `${process.env.REACT_APP_SERVER}`
});

const pwfindApi = axios.create({
	baseURL: `${process.env.REACT_APP_PWFINDAPI}`
});

const mainApi = axios.create({
	baseURL: `${process.env.REACT_APP_mainApi}`
})

api.interceptors.request.use((config)=> {
	config.headers['Content-type']['Accept'] = 'application/json; charset=UTF-8';
	config.headers['Authorization'] = `Bearer ${cookies.get('accessToken')}`
	return config;
}, (err) => {
	return Promise.reject(err);
});

export const apis = {
	// user
	signupAdd: (data) => api.post('/api/signup', data),
	passwordFind: (data) => pwfindApi.post('/api/password_check', data),
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
