import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import InputBox from "../elements/InputBox";
import Modal from "../elements/Modal";
import NavBox from "../elements/NavBox";
import StyledButton from "../elements/StyledButton";
import StyledContainer from "../elements/StyledContainer";
import { apis } from "../store/api";

const INITIAL_VALUES = {
  userEmail: "",
};

const PwFind = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [idMessage, setIdMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 유효성 검사
  const [isId, setIsId] = useState(false);

  const handleChange = (name, value) => {
    setValues(function (prevValues) {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
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

  // useMutation 세팅 함수
  const { mutate } = useMutation(apis.passwordFind, {
    onSuccess: (data) => {
      if (data.data.result) {
        setShowModal(true);
        alert("임시 비번을 이메일로 보냈습니다.");
        window.location.replace("/home");
      }
    },
    onError: (data) => {
    },
  });

  // 등록하는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(values);
  };

  return (
    <StyledContainer>
      <NavBox _title={"비밀번호 찾기"} />
      <InfoBox>
        등록하신 이메일로 <br />
        임시 비밀번호를 전송해드립니다.
      </InfoBox>
      <InputBox>
        <label>이메일 주소</label>
        <input
          type="email"
          name="useEmail"
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
      <StyledButton
        _title={"임시 비밀번호 전송"}
        _border={"1px solid #fc9215"}
        _bgColor={"#ffffff"}
        color={"#fc9215"}
        _margin={"36px 0px"}
        _onClick={handleSubmit}
      />
      <Modal
        _display={showModal}
        _confirm="로그인 하러가기"
        _alert={true}
        confirmOnClick={() => {
          navigate("/login");
        }}
      >
        <div className="text_area">
          <h3>
            입력하신 이메일로
            <br />
            임시 비밀번호를 전송했습니다.
          </h3>
        </div>
      </Modal>
    </StyledContainer>
  );
};

const DivBox = styled.div`
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

const InfoBox = styled.div`
  padding: 16px 0px;
  font-weight: 400;
  font-size: 21px;
  line-height: 34px;
`;

const Message = styled.p`
  font-size: 13px;
  align-self: flex-start;
  padding: 5px 0;
  color: ${(props) => (props.className === "success" ? "green" : "red")};
`;

export default PwFind;
