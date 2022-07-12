import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../elements/Button";
import Input from "../elements/Input";
import InputBox from "../elements/InputBox";
import Modal from "../elements/Modal";
import NavBox from "../elements/NavBox";
import StyledButton from "../elements/StyledButton";
import StyledContainer from "../elements/StyledContainer";
import { apis } from "../store/api";

const IdFind = () => {
  const mobileRef = useRef();
  const navigate = useNavigate();
  const [findId, setFindId] = useState(false);
  const [numberState, setNumberState] = useState();
  const [foundId, setFoundId] = useState();
  const [showModal, setShowModal] = useState(false);

// 아이디 찾기 후 아이디 저장
const [userEmail, setUserEmail] = useState("example@petsitt.com")

  const {
    data: find_id_query,
    isLoading: findIdLoading,
    isSuccess: idFoundSucceess,
  } = useQuery(
    ["find_id", numberState],
    () => apis.idFind({ phoneNumber: numberState }),
    {
      onSuccess: (data) => {
        console.log("success", data);
      },
      onError: (data) => {
        console.log(data, "error");
        window.alert(data.response.data.errorMessage);
      },
      enabled: !!findId,
      staleTime: Infinity,
    }
  );
  useEffect(() => {
	// setShowModal(true);
    if (!foundId && idFoundSucceess) {
      setFoundId(find_id_query?.data.user.userEmail);
      setShowModal(true);
    }
  }, [idFoundSucceess]);

  if (findIdLoading) return null;

  return (
    <StyledContainer>
      <NavBox _title={"아이디(이메일) 찾기"} />
      <InfoBox>
        회원가입 시 등록한
        <br />
        휴대폰 번호를 입력해주세요.
      </InfoBox>
      <InputBox>
        <label>핸드폰번호</label>
        <input
          type="text"
          name="mobileNumber"
          placeholder="'-' 없이 입력해주세요"
          ref={mobileRef}
          onChange={(e) => setNumberState(e.target.value)}
          required
        />
      </InputBox>
      <StyledButton
        _title={"아이디(이메일) 찾기"}
        _border={"1px solid #fc9215"}
        _bgColor={"#ffffff"}
        color={"#fc9215"}
		_margin={"36px 0px"}
		_onClick={() => setFindId(true)}
      />
      <Modal
        _display={showModal}
        _text={foundId}
        _confirm="로그인 하러가기"
        _alert={true}
        confirmOnClick={async () => {
          await sessionStorage.setItem("foundId", foundId);
          navigate("/login");
        }}
      >
		<div className="text_area">
          <h3>귀하의 아이디는 <br /><span>{userEmail}</span> 입니다</h3>
        </div>
	  </Modal>
    </StyledContainer>
  );
};

const InfoBox = styled.div`
  padding: 16px 0px;
  font-weight: 400;
  font-size: 21px;
  line-height: 34px;
`;

// const DivBox = styled.div`
//   h1 {
//     font-size: 34px;
//     font-weight: 600;
//   }
//   .inner {
//     &.required {
//       .tit {
//         font-size: 22px;
//         display: inline-block;
//         position: relative;
//         ::after {
//           content: "";
//           display: inline-block;
//           width: 6px;
//           height: 6px;
//           border-radius: 50%;
//           background-color: rgb(255, 107, 107);
//           position: absolute;
//           top: 0px;
//           right: -12px;
//         }
//       }
//     }
//   }
// `;

// const Message = styled.p`
//   font-size: 13px;
//   align-self: flex-start;
//   padding: 5px 0;
//   color: ${(props) => (props.className === "success" ? "green" : "red")};
// `;

export default IdFind;
