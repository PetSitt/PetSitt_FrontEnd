import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Button from '../elements/Button';
import Input from '../elements/Input';
import { apis } from '../store/api';
import NavBox from '../elements/NavBox';
import StyledContainer from '../elements/StyledContainer';
import Modal from '../elements/Modal';
import useInputs from "../hooks/useInputs";

const Myprofile = () => {
  const queryClient = useQueryClient();
  const { isLoading, data: userData } = useQuery('user', apis.myprofileGet, {
    staleTime: Infinity,
  });
  const [{phoneNumber, userEmail, userName}] = useInputs(userData.data.myprofile);
  const inputEl1 = useRef();
  const inputEl2 = useRef();
  const [text, setText] = useState('수정');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { mutate } = useMutation(apis.myprofilePatch, {
    onSuccess: ({ data }) => {
      if (data.myprofile) {
        setShowModal(true)
      }
      queryClient.invalidateQueries('user')
    },
    onError: (data) => {
      alert(data.response.data.errorMessage);
      navigate('/login');
    }
  });

  const isLogin = localStorage.getItem('accessToken');
  const handleUpdate = (e) => {
    inputEl1.current.disabled = false;
    inputEl2.current.disabled = false;

    const currentDatas = {
      userName: inputEl1.current.value,
      phoneNumber: inputEl2.current.value
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
                defaultValue={userName}
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
                defaultValue={phoneNumber}
                disabled
              />
            </label>
            <label className='inner required'>
              <p className='tit'>이메일</p>
              <Input
                 _width='100%'
                 _height='44px'
                 _type='text'
                 defaultValue={userEmail}
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

      <Modal
        _display={showModal}
        _confirm="저장하기"
        _alert={true}
        confirmOnClick={async () => {
          navigate("/mypage");
        }}
      >
		    <div className="text_area">
          <h3>프로필 정보를 수정했습니다.</h3>
        </div>
	    </Modal>
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
