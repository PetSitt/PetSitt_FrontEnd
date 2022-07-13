import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NavBox = ({ _title }) => {
    const navigate = useNavigate();
  return (
    <NavWrap>
      <button onClick={() => {navigate(-1)}}>
        <img src='/images/left_arrow.svg' alt='left_arrow' />
      </button>
      <h1>{_title}</h1>
      <div />
    </NavWrap>
  );
};

NavBox.defaultProps = {
  _title: "텍스트",
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

export default NavBox;
