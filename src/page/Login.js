/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { Cookies } from 'react-cookie';
import { apis } from '../store/api';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InputBox from '../elements/InputBox';
import StyledButton from '../elements/StyledButton';
import NavBox from '../elements/NavBox';
import StyledContainer from '../elements/StyledContainer';

const Login = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const email_ref = useRef();
  const pw_ref = useRef();
  const login = (data) => {
    return apis.login(data);
  };
  const { mutate: loginQuery } = useMutation(login, {
    onSuccess: async (data) => {
      await localStorage.setItem('accessToken', data.data.accessToken);
      await cookies.set('refreshToken', data.data.refreshToken);
      // await localStorage.setItem('userEmail', data.data.userEmail)
      await sessionStorage.removeItem('foundId');

      console.log(data);
      navigate('/');
    },
    onError: (data) => {
      // console.error(data);
      alert(data.response.data.errorMessage);
    },
  });
  // 로그인 여부 확인하는 api
  // const { mutate: checkUser } = useMutation(()=>apis.checkUser(), {
  // 	onSuccess: (data) => {
  // 		if(cookies.get('accessToken')){
  // 			cookies.remove('accessToken');
  // 			localStorage.removeItemItem('refreshToken');
  // 		}
  // 		console.log(data);
  // 	},
  // });
  
  useEffect(() => {
    const foundId = sessionStorage.getItem('foundId');
    // 아이디 찾기 페이지에서 접속했을 경우 input value에 찾은 id 입력
    if (foundId) {
      email_ref.current.value = foundId;
    }
    if (!localStorage.getItem('accessToken')) {
      // accessToken 없으면 refreshToken도 삭제
      cookies.remove('refreshToken');
    } else {
      // 로그인된 상태에서 로그인 페이지 접근했을 경우 로그아웃처리
      localStorage.removeItem('accessToken');
      cookies.remove('refreshToken');
      sessionStorage.removeItem('foundId');
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
          />
          {/* {values.userEmail && (
            <Message className={`${isId ? "success" : "error"}`}>
              {idMessage}
            </Message>
          )} */}
        </InputBox>
        <InputBox>
          <label className='inner required'>비밀번호</label>
          <input
            type="password"
            name="userPwd"
            ref={pw_ref}
            placeholder="4~10자리(특수문자, 숫자, 영어 포함)"
            required
          />
          {/* {values.password && (
            <Message className={`${isId ? "success" : "error"}`}>
              {idMessage}
            </Message>
          )} */}
        </InputBox>
        <StyledButton
          _onClick={() => {
            const data = {
              userEmail: email_ref.current.value,
              password: pw_ref.current.value,
            };
            loginQuery(data);
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
          _onClick={() => navigate('/signup')}
          color={'#381E1F'}
          _bgColor={'#fde40b'}
          _title={'카카오로 시작하기'}
        />
      </RegisterBox>
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

export default Login;
