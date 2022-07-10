import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const jsonApi = axios.create({
	baseURL: process.env.REACT_APP_SERVER
});

const formDataApi = axios.create({
	baseURL: process.env.REACT_APP_SERVER
});

const pwfindApi = axios.create({
	baseURL: process.env.REACT_APP_PWFINDAPI
});

const mainApi = axios.create({
	baseURL: process.env.REACT_APP_MAINAPI
});

const detailApi = axios.create({
	baseURL: process.env.REACT_APP_DETAILAPI
})

const authApi = axios.create({
	baseURL: process.env.REACT_APP_PWFINDAPI
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
authApi.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
		const refreshToken = await cookies.get('refreshToken');
    const newRequestResult = await axios.post('http://3.35.135.160/api/refresh', {refreshToken}, {headers: {
			"Authorization" : `Bearer ${cookies.get('accessToken')}`		
		}}).then(
			res => {
				console.log('refresh api response',res);
			}
		).catch(
			err => {
				console.log('refresh api error', err, err.response.status, 'error message: ',err.response.data.message);
			}
		);       
		// console.log(newRequestResult)     
    // axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    // return axiosApiInstance(originalRequest);
  }
  return Promise.reject(error);
});

export const apis = {
	// user
	signupAdd: (data) => jsonApi.post('/api/signup', data),
	passwordFind: (data) => pwfindApi.post('/api/password_check', data),
	idFind: (data) => pwfindApi.post('/api/id_check', data),
	login: (data) => jsonApi.post('/api/login', data),
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
	getSittersList: (queriesData) => mainApi.post('/mains/search', queriesData),
  
	// detail
	getUserDetail: (sitterId) => detailApi.get(`/details/${sitterId}`),
	getReviews: (sitterId, reviewId) => detailApi.get(`/details/reviews/${sitterId}`, reviewId),
}
