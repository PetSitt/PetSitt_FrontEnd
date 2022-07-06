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
	baseURL: `${process.env.REACT_APP_MAINAPI}`
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
	getSittersList: (queriesData, data) => mainApi.get('/mains/search', queriesData),
  
	// detail
	getUserDetail: (sitterId) => detailApi.get(`/details/${sitterId}`),
}
