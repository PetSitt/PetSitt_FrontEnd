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
	baseURL: process.env.REACT_APP_SERVER
});

const detailApi = axios.create({
	baseURL: process.env.REACT_APP_SERVER
})

const authApi = axios.create({
	baseURL: process.env.REACT_APP_PWFINDAPI,
})

jsonApi.interceptors.request.use((config)=> {
	config.headers['Content-type'] = 'application/json; charset=UTF-8';
	config.headers['Accept'] = 'application/json;';
	config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
	return config;
}, (err) => {
	return Promise.reject(err);
});

formDataApi.interceptors.request.use((config) => {
	config.headers['Content-type'] = 'multipart/form-data';
	config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
	return config;
}, (err) => {
	return Promise.reject(err);
});

authApi.interceptors.request.use((config)=> {
	config.headers['Content-type'] = 'application/json; charset=UTF-8';
	config.headers['Accept'] = 'application/json;'
	config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
	console.log('request success', config)
	return config;
}, (err) => {
	console.log('request err')

	return Promise.reject(err);
});

/* refresh 토큰을 활용하여 access 토큰을 재발급받기 위한 코드 - 수정중 */
authApi.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    console.log('토큰 만료')
    originalRequest._retry = true;
    // const sessionObj = window.sessionStorage.getItem('userInfo');
    // let userInfo = sessionObj ? JSON.parse(sessionObj) : null;
		const refreshToken = cookies.get('refreshToken');
    const access_token = await authApi.post('api/refresh', // token refresh api
			{
				refreshToken,
			}
		);
    console.log(access_token.data.accessToken)
			const newAccessToken = access_token.data.accessToken;
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      localStorage.setItem('accessToken', newAccessToken);
    return axios(originalRequest);
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
	reservation: () => jsonApi.get('/reservations'),
	sitterprofileGet: () => jsonApi.get('/mypage/sitterprofile'),
	sitterprofilePost: (data) => formDataApi.post('/mypage/sitterprofile', data),
	sitterprofilePatch: (data) => formDataApi.patch('/mypage/sitterprofile', data),
	sitterprofileDelete: () => jsonApi.delete('/mypage/sitterprofile'),

	// main
	getSittersList: (queriesData) => mainApi.post('/mains/search', queriesData),
  getSittersDefault: (data) => mainApi.post('/mains', data),
	// getSittersList: (queriesData) => axios.post('https://kimguen.com/mains/search', queriesData),
  // getSittersDefault: (data) => axios.post('https://kimguen.com/mains', data),

	// detail
	getUserDetail: (sitterId) => detailApi.get(`/details/${sitterId}`),
	getReviews: (sitterId, reviewId) => detailApi.post(`/details/reviews/${sitterId}`, reviewId),
	// getUserDetail: (sitterId) => axios.get(`https://kimguen.com/details/${sitterId}`),
	// getReviews: (sitterId, reviewId) => axios.post(`https://kimguen.com/details/reviews/${sitterId}`, reviewId),

	// reservation
	reservation: () => jsonApi.get('/reservations'),
	makeReservation: (data, sitterId) => jsonApi.post(`/reservations/regist/${sitterId}`, data),
	reservationList: (type) => jsonApi.get(`/reservations/lists?searchCase=${type}`),
	reservationDetail: (reservationId, type) => jsonApi.get(`/reservations/details/${reservationId}?searchCase=${type}`),
	cancelReservation: (reservationId) => jsonApi.put(`/reservations/cancel/${reservationId}`),
	registerReview: (reservationId, data) => jsonApi.post(`/reviews/${reservationId}`, data),
	loadMorePastReservation: (reservationId, type) => jsonApi.get(`/reservations/lists/${reservationId}?searchCase=${type}`),
	loadReview: (reservationId) => jsonApi.get(`/reviews/${reservationId}`),
	registerDiary: (reservationId, formdata, config) => jsonApi.post(`/diarys/${reservationId}`, formdata, config),
	loadDiaryData: (reservationId) => jsonApi.get(`/diarys/${reservationId}`),
	modifyDiary: (reservationId, formData) => jsonApi.put(`/diarys/${reservationId}`, formData)
}
