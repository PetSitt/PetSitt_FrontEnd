import { Link } from "react-router-dom";
import styled from "styled-components";

const SitterProfile = () => {
  return (
    <SitterProfileInner>
      <h1>돌보미 프로필</h1>
      <div className="inner">
        <Link to={{ pathname: `/mypage/SitterProfileForm1` }}>
          <button>돌보미로 등록하세요</button>
        </Link>
      </div>
    </SitterProfileInner>
  );
};

const SitterProfileInner = styled.div``;
export default SitterProfile;
