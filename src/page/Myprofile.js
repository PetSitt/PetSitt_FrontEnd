import React, {useRef, useState} from "react";
import styled from "styled-components";
import Button from '../elements/Button';
import Input from '../elements/Input';

const INITIAL_VALUES = {
	userName:'',
	phoneNumber: '',
	userEmail: '',
}

const Myprofile = () => {
	const [userInfo, setUserInfo] = useState(INITIAL_VALUES)
	const handleUpdate = () => {
		console.log(userInfo)
	}


	return (
		<MyprofileInner>
			<div className='myprofileInner'>
				<h1>내 프로필</h1>
				<Button onClick={handleUpdate}>수정</Button>
			</div>
			<label className="inner required">
				<p className="tit">이름</p>
				<Input _width="100%" _height="44px" _type="text" disabled/>
			</label>
			<label className="inner required">
				<p className="tit">전화번호</p>
				<Input _width="100%" _height="44px" _type="text" disabled/>
			</label>
			<label className="inner required">
				<p className="tit">이메일</p>
				<Input _width="100%" _height="44px" _type="text" disabled/>
			</label>
		</MyprofileInner>
	);
}

const MyprofileInner = styled.div`
	.myprofileInner {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
`
export default Myprofile;