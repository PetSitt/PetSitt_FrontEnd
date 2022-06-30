import { useState } from "react";
import { useMutation } from "react-query";
import styled from "styled-components";
import Button from "../elements/Button";
import Input from "../elements/Input";
import { apis } from "../store/api";

const INITIAL_VALUES = {
	userEmail: '',
};

const PwFind = () => {
	const [values, setValues] = useState(INITIAL_VALUES);
	const [idMessage, setIdMessage] = useState("")
	// 유효성 검사
	const [isId, setIsId] = useState(false)

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

	// 회원가입 유효성 검사
	const idCheck = (e) => {
		handleInputChange(e)
		const regId = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
		const idCurrent = e.target.value;

		if (!regId.test(idCurrent)) {
				setIdMessage("이메일 형식에 맞게 입력해주세요")
				setIsId(false)
		} else {
				setIdMessage("올바른 이메일 형식 입니다")
				setIsId(true)
		}
	}

	// useMutation 세팅 함수
	const {mutate} = useMutation(apis.passwordFind, {
    onSuccess: (data) => {
			console.log(data)
    },
		onError: (data) => {
			console.log(data)
		}
  });

	// 등록하는 함수
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(values)
		mutate(values)
  };

	return (
		<Form onSubmit={handleSubmit}>
			<h1>비밀번호 찾기</h1>
			<label className="inner required">
				<p className="tit">아이디(이메일)</p>
				<Input _width="100%" _height="44px" _placeholder="test@gmail.com" _type="email" _name={"userEmail"} onChange={idCheck} required />
				{ values.userEmail && <Message className={`${isId ? "success" : "error"}`}>{idMessage}</Message>}
			</label>
			<Button>전송</Button>
		</Form>
	);
}

const Form = styled.form`
	h1 {
		font-size: 34px;
		font-weight: 600;
	}
	.inner {
		&.required {
			.tit {
				font-size: 22px;
				display: inline-block;
				position: relative;
				::after {
					content: '';
					display: inline-block;
					width: 6px;
					height: 6px;
					border-radius: 50%;
					background-color: rgb(255, 107, 107);
					position: absolute;
					top: 0px;
					right: -12px;
				}
			}
		}
	}
`

const Message = styled.p`
  font-size: 13px;
  align-self: flex-start;
  padding: 5px 0;
  color: ${(props) => (props.className === "success" ? "green" : "red")}
`

export default PwFind;