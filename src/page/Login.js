/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Cookies } from 'react-cookie';
import jwt_decode from "jwt-decode"
import { apis } from '../store/api';
import { useMutation } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import InputBox from '../elements/InputBox';
import StyledButton from '../elements/StyledButton';
import NavBox from '../elements/NavBox';
import StyledContainer from '../elements/StyledContainer';
import Alert from "../elements/Alert";

const Login = ({socket}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const REST_API_KEY = process.env.REACT_APP_KAKAO_RESTAPI;
  const REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URL}&response_type=code`;

  const cookies = new Cookies();
  const email_ref = useRef();
  const pw_ref = useRef();

  // 에러메세지 상태 저장
  const [errorMessage, setErrorMessage] = useState({
    invalidEmail: {status: false, message: '존재하지 않는 이메일 주소입니다. 이메일 주소를 확인해주세요.'},
    invalidPw: {status: false, message: '비밀번호를 확인해주세요.'},
    emptyEmail: {status: false, message: '이메일 주소를 입력해주세요.'},
    emptyPw: {status: false, message: '비밀번호를 입력해주세요.'},
  });

  const { mutate: loginQuery } = useMutation(apis.login, {
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.accessToken);
      const messageData = { //서버가 필요한 데이터 형식
        userEmail: jwt_decode(localStorage.getItem('accessToken')).userEmail
      };
      if(data.data.accessToken){
        socket.emit('join_my_room', messageData)
      }
      cookies.set('refreshToken', data.data.refreshToken);
      navigate('/');      
    },
    onError: (data) => {
      if(data.response.status === 400){
        // 이메일 틀렸을 때 - 없는 아이디
        setErrorMessage((prev)=>{
          const _error = {...prev};
          _error.invalidEmail.status = true;
          _error.invalidPw.status = false;
          return _error;
        });
      }
      if(data.response.status === 401){
        // 비밀번호 틀렸을 때
        setErrorMessage((prev)=>{
          const _error = {...prev};
          _error.invalidPw.status = true;
          _error.invalidEmail.status = false;
          return _error;
        });
      }
    },
  });
  
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      // accessToken 없으면 refreshToken도 삭제
      cookies.remove('refreshToken');
    }
    if (localStorage.getItem('accessToken') || localStorage.getItem('kakaoToken')){
      // 로그인된 상태에서 로그인 페이지 접근했을 경우 로그아웃처리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('kakaoToken');
      cookies.remove('refreshToken');
      localStorage.removeItem('userName');
			localStorage.removeItem('userEmail');
    }
  }, [cookies]);

  return (
    <StyledContainer>
      <NavBox _title={'로그인'} />
      <InputWrap>
        <InputBox>
          <label className='inner required'>아이디(이메일)</label>
          <input
            type="email"
            name="userEmail"
            ref={email_ref}
            placeholder="example@petsitt.com"
            required
            defaultValue={location.state?.userEmail ? location.state?.userEmail : ''}
            onInput={(e)=>{
              if(e.target.value.length){
                setErrorMessage((prev)=>{
                  const _error = {...prev};
                  _error.emptyEmail.status = false;
                  return _error;
                });
              }
            }}
          />
          {errorMessage?.invalidEmail.status && (
            <Message>{errorMessage.invalidEmail.message}</Message>
          )}
          {errorMessage?.emptyEmail.status && (
            <Message>{errorMessage.emptyEmail.message}</Message>
          )}
        </InputBox>
        <InputBox>
          <label className='inner required'>비밀번호</label>
          <input
            type="password"
            name="userPwd"
            ref={pw_ref}
            placeholder="4~10자리(특수문자, 숫자, 영어 포함)"
            required
            onInput={(e)=>{
              if(e.target.value.length){
                setErrorMessage((prev)=>{
                  const _error = {...prev};
                  _error.emptyPw.status = false;
                  return _error;
                });
              }
            }}
          />
          {errorMessage?.invalidPw.status && (
            <Message>{errorMessage.invalidPw.message}</Message>
          )}
          {errorMessage?.emptyPw.status && (
            <Message>{errorMessage.emptyPw.message}</Message>
          )}
        </InputBox>
        <StyledButton
          _onClick={() => {
            if(!email_ref.current?.value.trim().length){
              setErrorMessage((prev)=>{
                const _error = {...prev};
                _error.emptyEmail.status = true;
                _error.invalidEmail.status = false;
                return _error;
              });
            }
            if(!pw_ref.current?.value.trim().length){
              setErrorMessage((prev)=>{
                const _error = {...prev};
                _error.emptyPw.status = true;
                _error.invalidPw.status = false;
                return _error;
              });
            }
            if(email_ref.current?.value.trim().length && pw_ref.current?.value.trim().length){
              const data = {
                userEmail: email_ref.current.value,
                password: pw_ref.current.value,
              };
              loginQuery(data);
            }
          }}
          _title={'로그인'}
        />
      </InputWrap>
      <FindBox>
        <ul>
          <li>
            <button type="button" onClick={() => navigate('/idfind')}>
              아이디 찾기
            </button>
          </li>
          <li>
            <button type="button" onClick={() => navigate('/pwfind')}>
              비밀번호 찾기
            </button>
          </li>
        </ul>
      </FindBox>
      <DevideBar>또는</DevideBar>
      <RegisterBox>
        <StyledButton
          _onClick={() => navigate('/signup')}
          _border={'1px solid #fc9215'}
          _bgColor={'#ffffff'}
          color={'#fc9215'}
          _margin={'0 0 10px 0'}
          _title={'이메일로 시작하기'}
        />
        <StyledButton
          _onClick={() => window.location.href = `${KAKAO_AUTH_URL}`}
          color={'#381E1F'}
          _bgColor={'#fde40b'}
          _title={'카카오로 시작하기'}
        />
      </RegisterBox>
      {
        location.state?.signup && <Alert _text={'회원가입이 완료되었습니다.'}/>
      }
    </StyledContainer>
  );
};

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const FindBox = styled.div`
  margin: 0px auto 16px auto;

  & ul li {
    float: left;
    :first-child::after {
      content: '|';
      float: right;
      display: block;
      font-weight: 200;
      color: rgba(120, 120, 120, 0.6);
    }

    & button {
      font-size: 12px;
      line-height: 14px;
      color: #787878;
      padding: 0px 16px;
    }
  }
`;

const DevideBar = styled.div`
  display: flex;
  flex-basis: 100%;
  align-items: center;
  font-size: 14px;
  line-height: 17px;
  color: #787878;
  text-align: center;
  margin: 48px 0px;
  ::before {
    content: '';
    flex-grow: 1;
    height: 1px;
    border-bottom: 1px solid rgba(120, 120, 120, 0.2);
    font-size: 0px;
    line-height: 0px;
    margin-right: 16px;
  }
  ::after {
    content: '';
    flex-grow: 1;
    height: 1px;
    border-bottom: 1px solid rgba(120, 120, 120, 0.2);
    font-size: 0px;
    line-height: 0px;
    margin-left: 16px;
  }
`;

const RegisterBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const Message = styled.p`
  font-size: 13px;
  align-self: flex-start;
  padding: 5px 0;
  color: #F01D1D;
`;

export default Login;
