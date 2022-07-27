import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import InputBox from "../elements/InputBox";
import NavBox from "../elements/NavBox";
import StyledButton from "../elements/StyledButton";
import StyledContainer from "../elements/StyledContainer";
import { handleChange } from "../shared/common";
import { apis } from "../store/api";

const INITIAL_VALUES = {
  userEmail: "",
  password: "",
  newPassword: "",
};

const PwChange = () => {
  const navigate = useNavigate();
  const pwOrdInput = useRef();
  const pwNewInput = useRef();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [pwMessage, setPwMessage] = useState("");
  const [pw2Message, setPw2Message] = useState("");
  const [isInvalidPw, setIsInvalidPw] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [isPw2, setIsPw2] = useState(false);

  // useMutation 세팅 함수
  const { mutate: passwordChang } = useMutation(apis.passwordChange, {
    onSuccess: ({ data }) => {
      sessionStorage.setItem('pwChanged', true);
      navigate('/mypage');
    },
    onError: (data) => {
      if(data.response.status === 401){
        setIsInvalidPw(true);
      }else{
        setIsInvalidPw(false);
      }
      // alert(data.response.data.errorMessage);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

  // 영문 숫자 포함해서 4~10 이내로
  const pwCheck = (e) => {
    handleInputChange(e);
    const regPw =
      /^.*(?=.{4,10})(?=.*[a-zA-Z])(?=.*?[A-Z])(?=.*\d)(?=.+?[\W|_])[a-zA-Z0-9!@#$%^&*()-_+={}\|\\\/]+$/gim;
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
    const datas = {
      userEmail: localStorage.getItem("userEmail"),
      password: values.password,
      newPassword: values.newPassword,
    };
    passwordChang(datas);
  };

  return (
    <StyledContainer>
      <Form onSubmit={handleSubmit}>
        <NavBox _title={"비밀번호 변경"} />
        <InputBox>
          <label className="inner required" htmlFor="password">
            기존 비밀번호
          </label>
          <input
            type="password"
            id="password"
            ref={pwOrdInput}
            name="password"
            onChange={handleInputChange}
            required
          />
          {isInvalidPw && <Message>기존 비밀번호와 일치하지 않습니다.</Message>}
        </InputBox>
        <InputBox>
          <label className="inner required" htmlFor="newPassword1">
            새로운 비밀번호
          </label>
          <input
            type="password"
            id="newPassword1"
            ref={pwNewInput}
            name="newPassword"
            onChange={pwCheck}
            required
          />
        </InputBox>
        {values.newPassword && (
          <Message className={`${isPw ? "success" : "error"}`}>
            {pwMessage}
          </Message>
        )}
        <InputBox>
          <label className="inner required" htmlFor="newPassword2">
            새로운 비밀번호 확인
          </label>
          <input
            type="password"
            id="newPassword2"
            ref={pwNewInput}
            name="newPassword"
            onChange={isSamePw}
            required
          />
        </InputBox>
        {values.newPassword && (
          <Message className={`${isPw2 ? "success" : "error"}`}>
            {pw2Message}
          </Message>
        )}
        <StyledButton _title="비밀번호 변경하기" />
      </Form>
    </StyledContainer>
  );
};

const Form = styled.form`

`;
const Message = styled.p`
  font-size: 13px;
  align-self: flex-start;
  color: ${(props) => (props.className === "success" ? "green" : "red")};
  padding: 5px 0;
`;

export default PwChange;
