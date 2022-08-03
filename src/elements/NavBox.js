import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NavBox = ({
  _title,
  _subTitle,
  _buttonTitle,
  _onClick,
  sitterProfile,
  sitterEditProfile,
  myProfile,
}) => {
  const navigate = useNavigate();
  if (myProfile) {
    return (
      <NavWrap>
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src="/images/left_arrow.svg" alt="left_arrow" />
        </button>
        <TitleBox>
          <h1>{_title}</h1>
          <span>{_subTitle}</span>
        </TitleBox>
        <CancelButton onClick={_onClick}>{_buttonTitle}</CancelButton>
      </NavWrap>
    );
  }

  if (sitterProfile) {
    return (
      <NavWrap>
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src="/images/left_arrow.svg" alt="left_arrow" />
        </button>
        <TitleBox>
          <h1 style={{ marginLeft: "45px" }}>{_title}</h1>
          <span>{_subTitle}</span>
        </TitleBox>
        <CancelButton onClick={_onClick}>{_buttonTitle}</CancelButton>
      </NavWrap>
    );
  }
  return (
    <NavWrap>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        <img src="/images/left_arrow.svg" alt="left_arrow" />
      </button>
      <h1>{_title}</h1>
      <div />
    </NavWrap>
  );
};

NavBox.defaultProps = {
  _title: "텍스트",
  _subTitle: "",
  sitterProfile: false,
};

const NavWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  & h1 {
    font-weight: 500;
    font-size: 21px;
    line-height: 25px;
  }
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    padding-left: 10px;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #676767;
  }
`;

const CancelButton = styled.button`
  font-weight: 400;
  font-size: 21px;
  line-height: 25px;
`;

export default NavBox;
