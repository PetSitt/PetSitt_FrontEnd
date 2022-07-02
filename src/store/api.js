import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:5001",
	headers: {
		'Content-type': 'application/json; charset=UTF-8',
		accept: 'application/json,',
	}
});

export const apis = {
	//user
	signup: (userEmail, userName, password, phoneNumber, basicAddress, detailAddress, longitude, latitude, postCode_front, postCode_back) => api.post('/user/signup', {
		userEmail,
		userName,
		password,
		phoneNumber,
		basicAddress,
		detailAddress,
		longitude,
		latitude,
		postCode_front,
		postCode_back
	}),
	passwordFind: (userEmail) => api.post('/user/password_check', {userEmail}),
	addSitter: (data) => api.post('/sitters', data),

}