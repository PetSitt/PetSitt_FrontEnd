import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import styled from 'styled-components';
import { useQuery, useMutation } from 'react-query';
import Button from '../elements/Button';
import Input from '../elements/Input';
import { apis } from '../store/api';
import NavBox from '../elements/NavBox';
import StyledContainer from '../elements/StyledContainer';

const Myprofile = () => {
  const { isLoading, data: userData } = useQuery('user', apis.myprofileGet);
  const inputEl1 = useRef();
  const inputEl2 = useRef();
  const inputEl3 = useRef();
  const [text, setText] = useState('수정');
  const cookies = new Cookies();
  const navigate = useNavigate();

  const { mutate } = useMutation(apis.myprofilePatch, {
    onSuccess: ({ data }) => {
      if (data.myprofile.acknowledged) {
        alert('프로필 정보를 수정했습니다.');
        window.location.reload();
      }
    },
    onError: (data) => {
      console.log(data);
      alert(data.response.data.errorMessage);
      navigate('/login');
    },
  });

  const isLogin = cookies.get('refreshToken');
  const handleUpdate = (e) => {
    console.log(inputEl1);
    inputEl1.current.disabled = false;
    inputEl2.current.disabled = false;
    inputEl3.current.disabled = false;

    const currentDatas = {
      userName: inputEl1.current.value,
      phoneNumber: inputEl2.current.value,
      userEmail: inputEl3.current.value,
    };

    if (text === '저장') {
      mutate(currentDatas);
    }
    setText('저장');
  };

  return (
    <StyledContainer>
      <MyprofileInner>
        {isLogin && (
          <NavBox
            _title='내 프로필'
            _buttonTitle={text}
            _onClick={handleUpdate}
            myProfile
          />
        )}
        {userData ? (
          <>
            <label className='inner required'>
              <p className='tit'>이름</p>
              <Input
                _width='100%'
                _height='44px'
                _type='text'
                _ref={inputEl1}
                defaultValue={userData.data.myprofile.userName}
                disabled
              />
            </label>
            <label className='inner required'>
              <p className='tit'>전화번호</p>
              <Input
                _width='100%'
                _height='44px'
                _type='text'
                _ref={inputEl2}
                defaultValue={userData.data.myprofile.phoneNumber}
                disabled
              />
            </label>
            <label className='inner required'>
              <p className='tit'>이메일</p>
              <Input
                _width='100%'
                _height='44px'
                _type='text'
                _ref={inputEl3}
                defaultValue={userData.data.myprofile.userEmail}
                disabled
              />
            </label>
          </>
        ) : (
          <Link to='/login'>
            <div className='button_inner'>
              <Button _width={'100%'}>로그인 및 회원가입</Button>
            </div>
          </Link>
        )}
      </MyprofileInner>
    </StyledContainer>
  );
};

const MyprofileInner = styled.div`
  input[type='text'] {
    width: 100%;
    min-height: 48px;
    background: #ffffff;
    border: 1px solid rgba(120, 120, 120, 0.4);
    border-radius: 6px;
    padding: 12px;
    :disabled {
      background: #eee;
    }
  }

  .button_inner {
    margin-top: 10px;
  }
  .tit {
    font-size: 16px;
    line-height: 19px;
    padding-bottom: 7px;
    margin-top: 24px;
  }
`;
export default Myprofile;
