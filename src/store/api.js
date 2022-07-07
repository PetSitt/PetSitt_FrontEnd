import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const jsonApi = axios.create({
	baseURL: `${process.env.REACT_APP_SERVER}`
});

const formDataApi = axios.create({
	baseURL: `${process.env.REACT_APP_SERVER}`
});

const pwfindApi = axios.create({
	baseURL: `${process.env.REACT_APP_PWFINDAPI}`
});

const mainApi = axios.create({
	baseURL: `${process.env.REACT_APP_MAINAPI}`
});

const detailApi = axios.create({
	baseURL: `${process.env.REACT_APP_DETAILAPI}`
})

const authApi = axios.create({
	baseURL: `${process.env.REACT_APP_PWFINDAPI}`
})

jsonApi.interceptors.request.use((config)=> {
	config.headers['Content-type'] = 'application/json; charset=UTF-8';
	config.headers['Accept'] = 'application/json;';
	config.headers['Authorization'] = `Bearer ${cookies.get('accessToken')}`
	return config;
}, (err) => {
	return Promise.reject(err);
});

formDataApi.interceptors.request.use((config) => {
	config.headers['Content-type'] = 'multipart/form-data';
	config.headers['Authorization'] = `Bearer ${cookies.get('accessToken')}`
	return config;
}, (err) => {
	return Promise.reject(err);
});

authApi.interceptors.request.use((config)=> {
	config.headers['Content-type'] = 'application/json; charset=UTF-8';
	config.headers['Accept'] = 'application/json;';
	config.headers['Authorization'] = `Bearer ${cookies.get('accessToken')}`
	return config;
}, (err) => {
	return Promise.reject(err);
});

export const apis = {
	// user
	signupAdd: (data) => jsonApi.post('/api/signup', data),
	passwordFind: (data) => pwfindApi.post('/api/password_check', data),
	idFind: (data) => pwfindApi.post('/api/id_check', data),
	login: (data) => pwfindApi.post('/api/login', data),
	checkUser: () => authApi.get('/api/auth'),

	// mypage
	myprofile: () => jsonApi.get('/mypage/myprofile'),
	myprofileGet: () => jsonApi.get('/mypage/myprofile'),
	myprofilePatch: (data) => jsonApi.patch('/mypage/myprofile', data),
	petprofileGet: () => jsonApi.get('/mypage/petprofile'),
	petprofilePost: (data) => formDataApi.post('/mypage/petprofile', data),
	petprofilePatch: ({id, data}) => formDataApi.patch(`/mypage/petprofile/${id}`, data),
  petprofileDelete: (id) => jsonApi.delete(`/mypage/petprofile/${id}`),
	// main
	getSittersList: (queriesData, data) => mainApi.get('/mains/search', queriesData),
  
	// detail
	getUserDetail: (sitterId) => detailApi.get(`/details/${sitterId}`),
	getReviews: (sitterId, reviewId) => detailApi.get(`/details/reviews/${sitterId}`, reviewId),
}
