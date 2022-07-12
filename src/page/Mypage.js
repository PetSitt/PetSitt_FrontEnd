import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../elements/Button";

const Mypage = () => {
  const isLogin = localStorage.getItem("accessToken");
  return (
    <MypageInner>
      <h1>마이페이지</h1>
      {isLogin ? (
        <div className="inner">
          <div className="profileInner">
            <div className="item">
              <Link to={{ pathname: `/mypage/myprofile` }}> 내 프로필 </Link>
            </div>
            <div className="item">
              <Link to={{ pathname: `/mypage/petprofile` }}> 반려동물 프로필 </Link>
            </div>
            <div className="item">
              <Link to={{ pathname: `/mypage/sitterprofile` }}>돌보미 프로필</Link>
            </div> 
          </div>
          <div>
            <div className="item">
              <Link to={{ pathname: `/pwchange` }}>비밀번호 변경</Link>
            </div>
            <div className="item">
              <Link to={{ pathname: `#0` }}>고객센터</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="inner">
          <p>로그인한 사용자만 접속할수 있습니다.</p>
          <Link to="/login">
            <Button>로그인</Button>
          </Link>
        </div>
      )}
    </MypageInner>
  );
};

const MypageInner = styled.div`
  padding-top: 24px;
  h1 {
    font-size: 24px;
  }
  .inner {
    margin-top: 24px;
    .item {
      height: 36px;
      line-height: 36px;
    }
    .profileInner {
      border-bottom: 1px solid rgba(120, 120, 120, 0.2);
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
  }
 `
export default Mypage;
