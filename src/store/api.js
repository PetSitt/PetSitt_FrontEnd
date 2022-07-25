import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const api = axios.create({
	baseURL: process.env.REACT_APP_SERVER
});

// 토큰 실어보내는 request interceptor
api.interceptors.request.use((config) => {
	config.headers['Content-type'] = 'application/json; charset=UTF-8';
	config.headers['Accept'] = 'application/json;';
	config.headers['Authorization'] = localStorage.getItem('accessToken') ? `Bearer ${localStorage.getItem('accessToken')}` : null;
	return config;
}, (err) => {
	return Promise.reject(err);
})

// Access 토큰 만료됐을 경우 Refresh 토큰으로 재요청 보내는 interceptor 추가된 응답 api
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    if (status === 401) { // 권한없음 === Access 토큰 만료됐을 경우
      const originalRequest = config;
			const refreshToken = await cookies.get('refreshToken');
			// token refresh 요청
			const { data } = await api.post('/api/refresh', {refreshToken});

			// 새로운 토큰 저장
			const {
				accessToken: newAccessToken,
			} = data;
			
			localStorage.setItem('accessToken', newAccessToken)
			api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
			originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
			// 401로 요청 실패했던 요청을 새로운 accessToken으로 재요청
			return axios(originalRequest);
    }
		localStorage.removeItem('accessToken');
		cookies.remove('refreshToken');
    return Promise.reject(error);
  }
);

const formdataConfig = {
	headers: {
		"Content-Type": "multipart/form-data",
	},
};
export const apis = {
	// user
	signupAdd: (data) => api.post('/api/signup', data),
	passwordFind: (data) => api.post('/api/password_check', data),
	idFind: (data) => api.post('/api/id_check', data),
	login: (data) => api.post('/api/login', data),
	kakaoLogin: (data) => api.post('/api/auth/kakao', data),
	checkUser: () => api.get('/api/auth'),

	// mypage
  passwordChange: (data) => api.put('/api/password_change', data),
	myprofile: () => api.get('/mypages/myprofile'),
	myprofileGet: () => api.get('/mypages/myprofile'),
	myprofilePatch: (data) => api.patch('/mypages/myprofile', data),
	petprofileGet: () => api.get('/mypages/petprofile'),
	petprofilePost: (data) => api.post('/mypages/petprofile', data),
	petprofilePatch: ({id, data}) => api.patch(`/mypages/petprofile/${id}`, data),
  petprofileDelete: (id) => api.delete(`/mypages/petprofile/${id}`),
	reservation: () => api.get('/reservations'),
	sitterprofileGet: () => api.get('/mypages/sitterprofile'),
	sitterprofilePost: (data) => api.post('/mypages/sitterprofile', data),
	sitterprofilePatch: (data) => api.patch('/mypages/sitterprofile', data),
	sitterprofileDelete: () => api.delete('/mypages/sitterprofile'),
	// main
	getSittersList: (queriesData) => api.post('/mains/search', queriesData),
  getSittersDefault: (data) => api.post('/mains', data),

	// detail
	getUserDetail: (sitterId) => api.get(`/details/${sitterId}`),
	getReviews: (sitterId, reviewId) => api.post(`/details/reviews/${sitterId}`, reviewId),
	getPetInfo: () => api.get('/informations/petcheck'),
	contactToSitter: (sitterId) => api.post(`/chats/${sitterId}`),

	// reservation
  reservation: () => api.get('/reservations'),
	makeReservation: (data, sitterId) => api.post(`/reservations/regist/${sitterId}`, data),
	reservationList: (type) => api.get(`/reservations/lists?searchCase=${type}`),
	reservationDetail: (reservationId, type) => api.get(`/reservations/details/${reservationId}?searchCase=${type}`),
	cancelReservation: (reservationId) => api.put(`/reservations/cancel/${reservationId}`),
	registerReview: (reservationId, data) => api.post(`/reviews/${reservationId}`, data),
	loadMorePastReservation: (reservationId, type) => api.get(`/reservations/lists/${reservationId}?searchCase=${type}`),
	loadReview: (reservationId) => api.get(`/reviews/${reservationId}`),
	registerDiary: (reservationId, formdata, config) => api.post(`/diaries/${reservationId}`, formdata, formdataConfig),
	loadDiaryData: (reservationId) => api.get(`/diaries/${reservationId}`),
	modifyDiary: (reservationId, formData) => api.put(`/diaries/${reservationId}`, formData, formdataConfig)
}
