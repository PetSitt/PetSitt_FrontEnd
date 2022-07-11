import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import Input from "../elements/Input";
import Button from "../elements/Button";
import { apis } from "../store/api";
import { useNavigate } from "react-router-dom";
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
    const regId =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const idCurrent = e.target.value;

    if (!regId.test(idCurrent)) {
      setIdMessage("이메일 형식에 맞게 입력해주세요");
      setIsId(false);
    } else {
      setIdMessage("올바른 이메일 형식 입니다");
      setIsId(true);
    }
  };

  // 영문 숫자 포함해서 6~20 이내로
  const pwCheck = (e) => {
    handleInputChange(e);
    const regPw = /^.{6,20}$/;
    const pwCurrent = e.target.value;

    if (!regPw.test(pwCurrent)) {
      setPwMessage("6~20자로 입력해주세요");
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
    <Form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <label className="inner required">
        <p className="tit">아이디(이메일)</p>
        <Input
          _width="100%"
          _height="44px"
          _placeholder="test@gmail.com"
          _type="email"
          _name={"userEmail"}
          onChange={idCheck}
          required
        />
        {values.userEmail && (
          <Message className={`${isId ? "success" : "error"}`}>
            {idMessage}
          </Message>
        )}
      </label>
      <label className="inner required">
        <p className="tit">비밀번호</p>
        <Input
          _width="100%"
          _height="44px"
          _placeholder="4~10자리(특수문자, 숫자, 영어 포함)"
          _type="password"
          id="pw"
          _name={"password"}
          onChange={pwCheck}
          required
        />
        {values.password && (
          <Message className={`${isPw ? "success" : "error"}`}>
            {pwMessage}
          </Message>
        )}
      </label>
      <label className="inner required">
        <p className="tit">비밀번호 확인</p>
        <Input
          _width="100%"
          _height="44px"
          _placeholder="4~10자리(특수문자, 숫자, 영어 포함)"
          _type="password"
          id="pw2"
          onChange={isSamePw}
          required
        />
        {values.password && (
          <Message className={`${isPw2 ? "success" : "error"}`}>
            {pw2Message}
          </Message>
        )}
      </label>
      <label className="inner required">
        <p className="tit">핸드폰번호</p>
        <Input
          _width="100%"
          _height="44px"
          _placeholder="'-' 없이 입력해주세요"
          _type="text"
          _value={phoneCurrent}
          _name={"phoneNumber"}
          onChange={phoneRegexr}
          required
        />
        {values.phoneNumber && (
          <Message className={`${isPhone ? "success" : "error"}`}>
            {phoneMessage}
          </Message>
        )}
      </label>
      <label className="inner required">
        <p className="tit">닉네임</p>
        <Input
          _width="100%"
          _height="44px"
          _type="text"
          id="pw2"
          _name={"userName"}
          onChange={handleInputChange}
          required
        />
      </label>
      <Button>전송</Button>
    </Form>
  );
};

const Form = styled.form`
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

export default Signup;
