import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import styled from "styled-components";
import { handleChange } from "../shared/common";
import { apis } from "../store/api";

const INITIAL_VALUES = {
  oldPassword: '',
	newPassword: '',
};

const PwChange = () => {
	const pwOrdInput = useRef();
	const pwNewInput = useRef();
	const [values, setValues] = useState(INITIAL_VALUES);
	const [pwMessage, setPwMessage] = useState("");
  const [pw2Message, setPw2Message] = useState("");
  const [isPw, setIsPw] = useState(false);
  const [isPw2, setIsPw2] = useState(false);

	// useMutation 세팅 함수
	const {mutate: passwordChang} = useMutation(apis.passwordChang, {
    onSuccess: (data) => {
			console.log(data)
    },
		onError: (data) => {
			console.log(data)
		}
  });

	const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

	// 영문 숫자 포함해서 4~10 이내로
	const pwCheck = (e) => {
    handleInputChange(e);
    const regPw = /^.*(?=.{4,10})(?=.*[a-zA-Z])(?=.*?[A-Z])(?=.*\d)(?=.+?[\W|_])[a-zA-Z0-9!@#$%^&*()-_+={}\|\\\/]+$/gim;
    const pwCurrent = e.target.value;

    if (!regPw.test(pwCurrent)) {
      setPwMessage("4~10자 이내 대/소문자,숫자,특수문자 조합으로 입력해주세요");
      setIsPw(false);
    } else {
      setPwMessage("올바른 비밀번호 입니다");
      setIsPw(true);
    }
  };

  //비밀번호 일치 체크 함수
  const isSamePw = (e) => {
    if (values.newPassword === e.target.value) {
      setPw2Message("비밀번호가 일치합니다");
      setIsPw2(true);
    } else {
      setPw2Message("비밀번호가 일치하지 않습니다");
      setIsPw2(false);
    }
  };

	// 전송하는 함수
	const handleSubmit = (e) => {
		e.preventDefault();
		passwordChang(values)
  };

	return (
		<Form onSubmit={handleSubmit}>
			<h1>비밀번호 변경</h1>
			<div className="inner">
				<label htmlFor="oldPassword" className="tit">기존 비밀번호</label>
				<input
					type="text"
					id="oldPassword"
					ref={pwOrdInput}
					name="oldPassword"
					onChange={handleInputChange}
					required
				/>
			</div>
			<div className="inner">
				<label htmlFor="newPassword1" className="tit">새로운 비밀번호</label>
				<input
					type="text"
					id="newPassword1"
					ref={pwNewInput}
					name="newPassword"
					onChange={pwCheck}
					required
				/>
			</div>
			{values.newPassword && (
				<Message className={`${isPw ? "success" : "error"}`}>
					{pwMessage}
				</Message>
			)}

			<div className="inner">
				<label htmlFor="newPassword2" className="tit">새로운 비밀번호 확인</label>
				<input
					type="text"
					id="newPassword2"
					ref={pwNewInput}
					name="newPassword"
					onChange={isSamePw}
					required
				/>
			</div>
			{values.newPassword && (
				<Message className={`${isPw2 ? "success" : "error"}`}>
					{pw2Message}
				</Message>
			)}
			<button>전송</button>
		</Form>
	);
}


const Form = styled.form`
	.inner {
		padding-bottom: 10px;
	}
  input,
  textarea {
    border: 1px solid #000;
  }
`;
const Message = styled.p`
  font-size: 13px;
  align-self: flex-start;
  color: ${(props) => (props.className === "success" ? "green" : "red")};
`;

export default PwChange;