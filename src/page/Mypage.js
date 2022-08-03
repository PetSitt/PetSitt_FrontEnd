import React, {useEffect, useState, useRef} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Modal from '../elements/Modal';
import Alert from '../elements/Alert';

const Mypage = ({close}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = localStorage.getItem('accessToken');
  const [modalDisplay, setModalDisplay] = useState();
  const [alertDisplay, setAlertDisplay] = useState(false);

  useEffect(()=>{
    if(sessionStorage.getItem('pwChanged')){
      setAlertDisplay(true);
    }
    sessionStorage.removeItem('pwChanged');
  },[])

  return (
    <>
    <MypageInner>
      <h1>마이페이지</h1>
      {isLogin ? (
        <div className='inner'>
          <div className='profileInner'>
              <Link to={{ pathname: `/mypage/myprofile` }}> 
                <div className='item'>내 프로필</div> 
              </Link>
            
              <Link to={{ pathname: `/mypage/petprofile` }}>
                <div className='item'> 반려동물 프로필</div>
              </Link>
            
              <Link to={{ pathname: `/mypage/sitterprofile` }}>
                <div className='item'>
                    돌보미 프로필
                </div>
              </Link>
          </div>
          <div className='profileInner'>
            {
               !localStorage.getItem('kakaoToken') && (
                  <Link to={{ pathname: `/pwchange` }}>
                    <div className='item'> 비밀번호 변경</div>
                  </Link>
               )
            }
          </div>
          <div>
            <button type="button" onClick={()=>setModalDisplay(true)}>
              <div className='item'>로그아웃</div>
            </button>
          </div>
        </div>
      ) : (
        <LoginBox>
          <h3>앗! 로그인이 안되어 있어요</h3>
          <p>로그인한 사용자만 접속할수 있습니다</p>
          <LoginButton
            onClick={() => {
              navigate('/login');
            }}
          >
            로그인
          </LoginButton>
        </LoginBox>
      )}
    </MypageInner>
    {
      modalDisplay && (
        <Modal _display={modalDisplay} _confirm={'로그아웃'} _cancel={'취소'} cancelOnclick={()=>setModalDisplay(false)} confirmOnClick={()=>navigate('/login')}>
          <div className="text_area">
            <h3>로그아웃</h3>
            <p>로그아웃 하시겠습니까?</p>
          </div>
        </Modal>
      )
    }
    {
      alertDisplay && <Alert _text={'비밀번호 변경이 완료되었습니다.'}/>
    }
    </>
  );
};

const MypageInner = styled.div`
  padding-top: 24px;
  h1 {
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
  }
  .inner {
    margin-top: 24px;
    .item {
      font-weight: 400;
      font-size: 18px;
      line-height: 22px;
      padding: 15px 0px;
      & > button{
        font-weight: 400;
        font-size: 18px;
      }
    }
    .profileInner {
      border-bottom: 1px solid rgba(120, 120, 120, 0.2);
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
    button {width:100%; display:block; text-align:left;}
  }
`;

const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 180px;
  h3 {
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    padding-bottom: 16px;
  }

  p {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #676767;
    padding-bottom: 24px;
  }
`;

const LoginButton = styled.button`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  padding: 12px 20px;
  background: #ffffff;
  border: 1px solid #fc9215;
  border-radius: 54px;
  color: #fc9215;
`;

export default Mypage;
