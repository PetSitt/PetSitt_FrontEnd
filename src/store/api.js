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

const detailApi = axios.create({
	baseURL: 'http://15.165.160.107/',
	headers: {
		'Content-type': 'application/json; charset=UTF-8',
		accept: 'application/json,',
	}
})

mainApi.defaults.paramsSerializer = function(paramObj) {
	const params = new URLSearchParams()
	for (const key in paramObj) {
			params.append(key, paramObj[key])
	}

	return params.toString()
}

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
	getSittersList: (queriesData, data) => mainApi.get('/mains/search', queriesData),
  
	// detail
	getUserDetail: (sitterId) => detailApi.get(`/details/${sitterId}`),
}
