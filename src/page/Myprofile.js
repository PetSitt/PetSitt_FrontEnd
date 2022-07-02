import React, {useRef, useEffect} from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import Button from '../elements/Button';
import Input from '../elements/Input';
import { apis } from "../store/api";

const Myprofile = () => {
	const {isLoading, data} = useQuery("user", apis.myprofile)
	const inputEl1 = useRef(null);
	const inputEl2 = useRef(null);
	const inputEl3 = useRef(null);

	const handleUpdate = (e) => {
		inputEl1.current.disabled = false
		inputEl2.current.disabled = false
		inputEl3.current.disabled = false
	}

	console.log(isLoading, data)
	useEffect(() => {
		apis.myprofile();
	},[])

	return (
		<MyprofileInner>
			<div className='myprofileInner'>
				<h1>내 프로필</h1>
				<Button onClick={handleUpdate}>수정</Button>
			</div>
			<label className="inner required">
				<p className="tit">이름</p>
				<Input _width="100%" _height="44px" _type="text" _ref={inputEl1} disabled/>
			</label>
			<label className="inner required">
				<p className="tit">전화번호</p>
				<Input _width="100%" _height="44px" _type="text" _ref={inputEl2} disabled/>
			</label>
			<label className="inner required">
				<p className="tit">이메일</p>
				<Input _width="100%" _height="44px" _type="text" _ref={inputEl3} disabled/>
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