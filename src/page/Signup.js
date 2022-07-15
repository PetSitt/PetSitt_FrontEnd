import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import { apis } from "../store/api";
import { useNavigate } from "react-router-dom";
import StyledContainer from "../elements/StyledContainer";
import NavBox from "../elements/NavBox";
import InputBox from "../elements/InputBox";
import StyledButton from "../elements/StyledButton";
import { handleChange } from "../shared/common";

const INITIAL_VALUES = {
  userEmail: "",
  userName: "",
  password: "",
  phoneNumber: "",
};

const Signup = () => {
  const [values, setValues] = useState(INITIAL_VALUES);
  // 에러메세지 상태 저장
  const [idMessage, setIdMessage] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pw2Message, setPw2Message] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");

  // 중복 체크
  const [phoneCurrent, setPhoneCurrent] = useState("");

  // 유효성 검사
  const [isId, setIsId] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [isPw2, setIsPw2] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

  // 회원가입 유효성 검사
  const idCheck = (e) => {
    handleInputChange(e);
    const regId = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const idCurrent = e.target.value;

    if (!regId.test(idCurrent)) {
      setIdMessage("이메일 형식에 맞게 입력해주세요");
      setIsId(false);
    } else {
      setIdMessage("올바른 이메일 형식 입니다");
      setIsId(true);
    }
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
    if (values.password === e.target.value) {
      setPw2Message("비밀번호가 일치합니다");
      setIsPw2(true);
    } else {
      setPw2Message("비밀번호가 일치하지 않습니다");
      setIsPw2(false);
    }
  };

  /* 휴대폰번호 검증 */
  function phoneRegexr(e) {
    handleInputChange(e);
    const phoneVal = e.target.value;
    setPhoneCurrent(phoneVal.replace(/[^0-9]/gi, ""));
    const phoneReg = /^\d{3}\d{3,4}\d{4}$/gim;
    if (!phoneReg.test(phoneVal)) {
      setPhoneMessage("정상적인 번호가 아닙니다.");
      setIsPhone(false);
    } else {
      setPhoneMessage("정상적인 번호 입니다.");
      setIsPhone(true);
    }
  }

  // useMutation 세팅 함수
  const { mutate, error, isSuccess } = useMutation(apis.signupAdd, {
    onSuccess: ({ data }) => {
      alert(data.message);
      navigate("/login");
    },
    onError: (data) => {
      console.log(data);
    },
  });

  // 등록하는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isId && isPw && isPhone) {
      mutate(values);
    }
  };

  return (
    <StyledContainer>
      <NavBox _title={"회원가입"} />
      <Form onSubmit={handleSubmit}>
        <InputBox>
          <label>아이디(이메일)</label>
          <input
            type="email"
            name="userEmail"
            placeholder="example@petsitt.com"
            onChange={idCheck}
            required
          />
          {values.userEmail && (
            <Message className={`${isId ? "success" : "error"}`}>
              {idMessage}
            </Message>
          )}
        </InputBox>
        <InputBox>
          <label>비밀번호</label>
          <input
            id="pw"
            type="password"
            name="password"
            placeholder="4~10자리(특수문자, 숫자, 영어 포함)"
            onChange={pwCheck}
            required
          />
          {values.password && (
            <Message className={`${isPw ? "success" : "error"}`}>
              {pwMessage}
            </Message>
          )}
        </InputBox>
        <InputBox>
          <label className="inner required">비밀번호 확인</label>
          <input
            type="password"
            name="passwordCheck"
            placeholder="4~10자리(특수문자, 숫자, 영어 포함)"
            onChange={isSamePw}
            required
          />
          {values.password && (
            <Message className={`${isPw2 ? "success" : "error"}`}>
              {pw2Message}
            </Message>
          )}
        </InputBox>
        <InputBox>
          <label>핸드폰번호</label>
          <input
            type="text"
            name="phoneNumber"
            value={phoneCurrent}
            placeholder="'-' 없이 입력해주세요"
            onChange={phoneRegexr}
            required
          />
          {values.phoneNumber && (
            <Message className={`${isPhone ? "success" : "error"}`}>
              {phoneMessage}
            </Message>
          )}
        </InputBox>
        <InputBox
          _label={"닉네임"}
          _type={"text"}
          _placeholder={"닉네임을 입력해주세요"}
          _name={"userName"}
          _onChange={handleInputChange}
          _value={phoneCurrent}
          required
        >
          <label>닉네임</label>
          <input
            type="text"
            name="userName"
            placeholder="닉네임을 입력해주세요"
            onChange={handleInputChange}
            required
          />
        </InputBox>
        <ButtonBox>
          <StyledButton _title={"회원가입"} />
        </ButtonBox>
      </Form>
    </StyledContainer>
  );
};

const Form = styled.form`
  position: relative;
  height: 90vh;
  h1 {
    font-size: 34px;
    font-weight: 600;
  }
  .inner {
    display: block;
    position: relative;
    margin-top: 20px;
    &.required {
      .tit {
        font-size: 22px;
        display: inline-block;
        position: relative;
        ::after {
          content: "";
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
`;
const Message = styled.p`
  font-size: 13px;
  align-self: flex-start;
  padding: 5px 0;
  color: ${(props) => (props.className === "success" ? "green" : "red")};
`;

const ButtonBox = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0px;
`;

export default Signup;
