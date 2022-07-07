import React, { useEffect, useRef } from "react";
import { Cookies } from "react-cookie";
import { apis } from "../store/api";
import { useMutation, useQueryClient } from "react-query";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const cookies = new Cookies();
	const email_ref = useRef();
	const pw_ref = useRef();

	const login = (data) => {
		return apis.login(data);
	};
	const { mutate: loginQuery } = useMutation(login, {
		onSuccess: async (data) => {
			console.log(data);
			await cookies.set("accessToken", data.data.accessToken);
			await localStorage.setItem("refreshToken", data.data.refreshToken);
			await sessionStorage.removeItem('foundId');
			navigate('/')
		},
		onError: (data) => {
			console.error(data);
			alert(data.response.data.errorMessage);
		},
	});
	// 로그인 여부 확인하는 api
	// const { mutate: checkUser } = useMutation(()=>apis.checkUser(), { 
	// 	onSuccess: (data) => {
	// 		if(cookies.get('accessToken')){ 
				
	// 			cookies.remove('accessToken');
	// 			localStorage.removeItem('refreshToken');
	// 		}
	// 		console.log(data);
	// 	},
	// });

	useEffect(() => {
		const foundId = sessionStorage.getItem('foundId');
		// 아이디 찾기 페이지에서 접속했을 경우 input value에 찾은 id 입력
		if(foundId){
			email_ref.current.value = foundId;
		}
		if(!cookies.get('accessToken')){
			// accessToken 없으면 refreshToken도 삭제
			localStorage.removeItem('refreshToken');
		}else{
			// 로그인된 상태에서 로그인 페이지 접근했을 경우 로그아웃처리
			cookies.remove('accessToken');
			localStorage.removeItem('refreshToken');
			sessionStorage.removeItem('foundId');
		}
	}, []);

	return (
		<>
			<input ref={email_ref} style={{ border: "1px solid #333" }} />
			<input ref={pw_ref} style={{ border: "1px solid #333" }} />
			<button
				type="button"
				onClick={() => {
					const data = {
						userEmail: email_ref.current.value,
						password: pw_ref.current.value,
					};
					loginQuery(data);
				}}
			>
				로그인
			</button>
			<ul>
			<li>
					<button type="button" onClick={()=>navigate('/idfind')}>아이디 찾기</button>
				</li>
				<li>
					<button type="button" onClick={()=>navigate('/pwfind')}>비밀번호 찾기</button>
				</li>
			</ul>
		</>
	);
};

export default Login;
