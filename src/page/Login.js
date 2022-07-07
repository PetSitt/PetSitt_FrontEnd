import React, { useEffect, useRef } from 'react';
import { Cookies } from 'react-cookie';
import { apis } from '../store/api';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
      console.log(data);
      await cookies.set('accessToken', data.data.accessToken);
      await localStorage.setItem('refreshToken', data.data.refreshToken);
      await sessionStorage.removeItem('foundId');
      navigate('/');
    },
    onError: (data) => {
      console.error(data);
      alert(data.response.data.errorMessage);
    },
  });
  // 로그인 여부 확인하는 api
  // const { mutate: checkUser } = useMutation(()=>apis.checkUser(), {
  // 	onSuccess: (data) => {
  // 		if(cookies.get('accessToken')){

  // 			cookies.remove('accessToken');
  // 			localStorage.removeItem('refreshToken');
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
    if (!cookies.get('accessToken')) {
      // accessToken 없으면 refreshToken도 삭제
      localStorage.removeItem('refreshToken');
    } else {
      // 로그인된 상태에서 로그인 페이지 접근했을 경우 로그아웃처리
      cookies.remove('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('foundId');
    }
  }, []);

  return (
    <>
      <LoginContainer>
        <NavBox>
          <button>
            <img src="/images/left_arrow.svg" alt="left_arrow" />
          </button>
          <h1>로그인</h1>
          <div />
        </NavBox>
        <InputWrap>
          <InputBox>
            <label>아이디(이메일)</label>
            <input type="email" ref={email_ref} placeholder="example@petsitt.com" />
          </InputBox>
          <InputBox>
            <label>비밀번호</label>
            <input type="password" ref={pw_ref} placeholder="1234" />
          </InputBox>
          <button
            type="button"
            onClick={() => {
              const data = {
                userEmail: email_ref.current.value,
                password: pw_ref.current.value,
              };
              loginQuery(data);
            }}
          >
            로그인
          </button>
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
          <button type="button" onClick={() => navigate('/signup')}>
            이메일로 시작하기
          </button>
          <button type="button" onClick={() => navigate('/signup')}>
            카카오로 시작하기
          </button>
        </RegisterBox>
      </LoginContainer>
    </>
  );
};

const LoginContainer = styled.section`
  display: flex;
  flex-direction: column;
  padding: 65px 16px;
`;

const NavBox = styled.div`
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

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  & button {
    padding: 14px 0px;
    background: #fc9215;
    border-radius: 6px;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    margin: 16px 0px;
  }
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  & label {
    font-size: 16px;
    line-height: 19px;
    padding-bottom: 7px;
  }
  & input {
    border-bottom: 1px solid rgba(120, 120, 120, 0.2);
    padding: 9px 0px;
    ::placeholder {
      color: rgba(120, 120, 120, 0.6);
      font-size: 16px;
      line-height: 19px;
      font-weight: 400;
    }
    :focus::placeholder {
      color: transparent;
    }
  }
`;

const FindBox = styled.div`
  margin: 40px auto;
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

const RegisterBox = styled.div``;

export default Login;
