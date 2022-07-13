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
	baseURL: process.env.REACT_APP_PWFINDAPI,
	// withCredentials: true,
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




// let isTokenRefreshing = false;
// let refreshSubscribers = [];

// const onTokenRefreshed = (accessToken) => {
//   refreshSubscribers.map((callback) => callback(accessToken));
// };

// const addRefreshSubscriber = (callback) => {
//   refreshSubscribers.push(callback);
// };

// authApi.interceptors.response.use(
//   (response) => {
// 		console.log(response)
//     return response;
//   },
//   async (error) => {
// 		console.log(error,  error.config, error.response.status)
//     const {
//       config,
//       response: { status },
//     } = error;
//     const originalRequest = config;
// 		console.log(originalRequest._retry)
//     if (status === 401) {
// 			console.log('401~~~~~ ')
//       if (!isTokenRefreshing) {
//         // isTokenRefreshing이 false인 경우에만 token refresh 요청
//         isTokenRefreshing = true;
//         const refreshToken = await cookies.get('refreshToken');
//         const newRequest = await authApi.post('api/refresh', // token refresh api
//           {
//             refreshToken,
//           }
//         );
//         // 새로운 토큰 저장
// 				const newAccessToken = newRequest.data.accessToken;
//         await localStorage.setItem('accessToken', newAccessToken);
//         isTokenRefreshing = false;
//         authApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
//         // 새로운 토큰으로 지연되었던 요청 진행
//         onTokenRefreshed(newAccessToken);

// 				console.log('? 1111',newAccessToken, newRequest,originalRequest.url)
//       }
//       // token이 재발급 되는 동안의 요청은 refreshSubscribers에 저장
//       const retryOriginalRequest = new Promise((resolve) => {
// 				console.log('resolve',resolve)
//         addRefreshSubscriber((newAccessToken) => {
//           originalRequest.headers.Authorization = "Bearer " + newAccessToken;
//           resolve(axios(originalRequest));
//         });
//       });
// 			console.log('? retry', originalRequest.url)
//       return retryOriginalRequest;
//     }
// 		console.log('reject')
//     return Promise.reject(error);
//   }
// );


// Response interceptor for API calls
// authApi.interceptors.response.use((response) => {
//   return response
// }, async function (error) {
//   const originalRequest = error.config;
// 	console.log('originalRequest url', originalRequest.url)
// 	if (error.response.status === 401 && originalRequest.url === "/api/refresh"){
// 		console.log('Prevent infinite loops');
// 		return Promise.reject(error);
// 	}
//   if (error.response.status === 401 && originalRequest.url !== "/api/refresh") {
//     console.log('토큰 만료')
//     originalRequest._retry = true;
// 		const refreshToken = await cookies.get('refreshToken');
// 		const newRequest = await axios.post('http://3.35.135.160/api/refresh', {refreshToken});
// 		const newAccessToken = newRequest.data.NewAccessToken;
// 		console.log(newAccessToken,originalRequest)
// 		localStorage.setItem('accessToken', newAccessToken);
// 		originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
// 		// return axios(originalRequest);
//     // const access_token = await refreshAccessToken(userInfo.refreshToken);
// 		// originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
// 		// userInfo.accessToken = access_token;
//     // if(userInfo){
//     //   originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
//     //   userInfo.accessToken = access_token;
//     //   window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
//     // }
//     // return axios(originalRequest);
//   }
//   return Promise.reject(error);
// });





// authApi.interceptors.response.use((response) => {
//   return response
// }, async function (error) {
//   const originalRequest = error.config;
// 	console.log(error.response.status, error.response.status === 401)
//   if (error.response.status === 401 && !originalRequest._retry) {
// 		originalRequest._retry = true;
// 		const refreshToken = await cookies.get('refreshToken');
// 		// const newRequestResult = await axios.post('http://3.35.135.160/api/refresh', {refreshToken}, {headers: {
// 		console.log(refreshToken, typeof refreshToken)
// 		await axios.post('http://3.35.135.160/api/refresh', {refreshToken}).then(
// 		// await axios.get('http://3.35.135.160/api/refresh').then(
// 				res => {
// 				const newAccessToken = res.data.accessToken;
// 				localStorage.setItem('accessToken', newAccessToken);
// 				console.log('refresh api response',res,newAccessToken);

// 				authApi.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
// 				// axios(originalRequest);
// 			}
// 		).catch(
// 			err => {
// 				console.log('refresh api error', err);
// 				if (err.response) {
// 					// 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
// 					console.log(err.response.data);
// 					console.log(err.response.status);
// 					console.log(err.response.headers);
// 				} else if (err.request) {
// 					// 요청이 전송되었지만, 응답이 수신되지 않았습니다.
// 					// 'error.request'는 브라우저에서 XMLHtpRequest 인스턴스이고,
// 					// node.js에서는 http.ClientRequest 인스턴스입니다.
// 					console.log(err.request);
// 				} else {
// 					// 오류가 발생한 요청을 설정하는 동안 문제가 발생했습니다.
// 					console.log("Error", err.message);
// 				}
// 				console.log(err, err.config);
// 			}
// 		);     
// 		return axios(originalRequest);  
// 		// console.log(newRequestResult)     
//     // axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
//     // return axiosApiInstance(originalRequest);
//   }
//   return Promise.reject(error);
// });

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
	sitterProfilePost: (data) => formDataApi.post('/mypage/sitterprofile', data),
	
	// main
	getSittersList: (queriesData) => mainApi.post('/mains/search', queriesData),
  getSittersDefault: (data) => mainApi.post('/mains', data),

	// detail
	getUserDetail: (sitterId) => detailApi.get(`/details/${sitterId}`),
	getReviews: (sitterId, reviewId) => detailApi.post(`/details/reviews/${sitterId}`, reviewId),

	// reservation
	reservation: () => jsonApi.get('/reservations'),
	makeReservation: (data, sitterId) => jsonApi.post(`/reservations/regist/${sitterId}`, data),
	reservationList: (type) => jsonApi.get(`/reservations/lists?searchCase=${type}`),
}
