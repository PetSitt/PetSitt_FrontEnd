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
	const checkUserQuery = () => {
		return apis.checkUser();
	};

	const { mutate: loginQuery } = useMutation(login, {
		onSuccess: (data) => {
			console.log(data);
			cookies.set("accessToken", data.data.accessToken);
			localStorage.setItem("refreshToken", data.data.refreshToken);
		},
		onError: (data) => {
			console.error(data);
			alert(data.response.data.errorMessage);
		},
	});
	const { mutate: checkUser } = useMutation(checkUserQuery, { 
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (data) => {
			console.log(data, data.response.data.errorMessage);
		},
	});

	useEffect(() => {
		// checkUser(); // 로그인한 유저 확인하는 api. 현재 db 완료 안돼서 작성만 해놓고 주석처리 했습니다~
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
