import React, {useRef, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { Cookies } from "react-cookie";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Button from '../elements/Button';
import Input from '../elements/Input';
import { apis } from "../store/api";

const Myprofile = () => {
	const {isLoading, data} = useQuery("user", apis.myprofileGet);
	const inputEl1 = useRef(null);
	const inputEl2 = useRef(null);
	const inputEl3 = useRef(null);
	const [text, setText] = useState('수정')
	const cookies = new Cookies();

	const {mutate} = useMutation(apis.myprofilePatch, {
		onSuccess: ({data}) => {
			if(data.myprofile.acknowledged){
				alert("프로필 정보를 수정했습니다.")
				window.location.reload();
			}
		},
		onError: (data) => {
			console.log(data);
		}
	})

	const isLogin = cookies.get('accessToken');
	const handleUpdate = (e) => {
		inputEl1.current.disabled = false
		inputEl2.current.disabled = false
		inputEl3.current.disabled = false

		const currentDatas = {
			userName: inputEl1.current.value,
			phoneNumber: inputEl2.current.value,
			userEmail: inputEl3.current.value
		}

		if(text === "저장"){
			mutate(currentDatas)
		}
		setText('저장');
	}

	useEffect(() => {

	},[])

	return (
		<MyprofileInner>
			<div className='myprofileInner'>
				<h1>내 프로필</h1>
				{isLogin && <Button onClick={handleUpdate}>{text}</Button>}
			</div>
			{ 
			data ? (
				<>
					<label className="inner required">
						<p className="tit">이름</p>
						<Input _width="100%" _height="44px" _type="text" _ref={inputEl1} defaultValue={data.data.myprofile.userName} disabled/>
					</label>
					<label className="inner required">
						<p className="tit">전화번호</p>
						<Input _width="100%" _height="44px" _type="text" _ref={inputEl2} defaultValue={data.data.myprofile.phoneNumber} disabled/>
					</label>
					<label className="inner required">
						<p className="tit">이메일</p>
						<Input _width="100%" _height="44px" _type="text" _ref={inputEl3} defaultValue={data.data.myprofile.userEmail} disabled/>
					</label>
				</>
				) : (
					<Link to="/login">
						<div className="button_inner">
							<Button _width={"100%"}>로그인 및 회원가입</Button>
						</div>
					</Link>
				)
			}
		</MyprofileInner>
	);
}

const MyprofileInner = styled.div`
	.myprofileInner {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.button_inner {
		margin-top: 10px;
	}
`
export default Myprofile;