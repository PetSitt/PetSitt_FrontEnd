import React, { useState } from 'react';
import styled from "styled-components";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import Input from '../elements/Input';
import AddressInfo from '../components/AddressInfo';
import Button from '../elements/Button';

const INITIAL_VALUES = {
	phoneNumber: '',
	basicAddress: '',
	detailAddress:'',
	longitude:'',
	latitude:'',
	postCode_front: '',
	postCode_back: '', 
};

const Signup = () => {
	const [values, setValues] = useState(INITIAL_VALUES);
	const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

	const handleChange = (name, value) => {
    setValues(function(prevValues){
			return {
      	...prevValues,
      	[name]: value
			}
    });
  };

	const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };
	
	const handleComplete = (data) => {
		console.log(data)
		const {zonecode} = data;
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

		setValues((prevValue) => {
			return {
				...prevValue,
				address: fullAddress,
				zonecode: zonecode
			}
		})
  };
	const handleClick = () => {
		open({ onComplete: handleComplete });
	};

	// 등록하는 함수
	const handleSubmit = (e) => {
		e.preventDefault();
		const resOptions = {
			data: values
		};

		console.log(resOptions.data)
  };

	return (
			<Form onSubmit={handleSubmit}>
				<h1>Sign Up</h1>
				<label>
					<p className="tit">아이디(이메일)</p>
					<Input _width="100%" _height="44px" _placeholder="test@gmail.com" _type="email" id="id" required>아이디(이메일)</Input>
				</label>
				<label>
					<p className="tit">비밀번호</p>
					<Input _width="100%" _height="44px" _placeholder="4~10자리(특수문자, 숫자, 영어 포함)" _type="password" id="pw" required>아이디(이메일)</Input>
				</label>
				<label>
					<p className="tit">비밀번호 확인</p>
					<Input _width="100%" _height="44px" _placeholder="4~10자리(특수문자, 숫자, 영어 포함)" _type="password" id="pw2" required>아이디(이메일)</Input>
				</label>
				<label>
					<p className="tit">핸드폰번호</p>
					<Input _width="100%" _height="44px" _type="password" id="pw2" required>아이디(이메일)</Input>
				</label>
				<label>
					<p className="tit">닉네임</p>
					<Input _width="100%" _height="44px" _type="password" id="pw2" required>아이디(이메일)</Input>
				</label>
				<div className="address">
					<p className="tit">주소</p>
					<AddressInfo _address={values.address} _zonecode={values.zonecode} _name={"detailAddress"} handlePost={handleClick} onChange={handleInputChange} />
				</div>
				<Button>전송</Button>
			</Form>
	);
}

const Form = styled.form`
	h1 {
		font-size: 34px;
		font-weight: 600;
	}
	.tit {
		font-size: 22px;
	}
	label {
		position: relative;
	}
	.address {

	}
` 

export default Signup;