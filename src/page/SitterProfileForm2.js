import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { handleChange } from '../shared/common';
import ImageRegist from '../components/ImageRegist';
import StyledContainer from '../elements/StyledContainer';
import NavBox from '../elements/NavBox';
import InputBox from '../elements/InputBox';
import StyledButton from '../elements/StyledButton';

const INITIAL_VALUES = {
  imageUrl: '',
  mainImageUrl: '',
  introTitle: '',
  myIntro: '',
};

const SitterProfileForm2 = () => {
  const navigate = useNavigate();
  const { data, update } = useLocation().state;
  const [values, setValues] = useState(
    update ? data : { ...data, ...INITIAL_VALUES }
  );
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    handleChange(name, files[0], setValues);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

  const [errorMessages, setErrorMessage] = useState({
    imageUrl: false,
    mainImageUrl: false,
    introTitle: false,
    myIntro: false,
  })

  const toggleErrorMessage = (target, status) => {
    setErrorMessage((prev)=>{
      const newData = {...prev};
      newData[target] = status;
      return newData;
    })
  }

  const doValidation = () => {
    let emptyLength = 0;
    for(let i=0; i<Object.keys(errorMessages).length; i++){
      if(!values[Object.keys(errorMessages)[i]] || values[Object.keys(errorMessages)[i]] === ''){
        toggleErrorMessage(Object.keys(errorMessages)[i], true);
        emptyLength++;
      }else{
        toggleErrorMessage(Object.keys(errorMessages)[i], false);
      }
    }
    if(emptyLength === 0){
      navigate('/mypage/SitterProfileForm3', {state: { data: values, update: update ? true : false }});
    }
  }
  return (
    <StyledContainer>
      <SitterProfileFormInner>
        <NavBox _title='상세 정보' _subTitle='2/4' sitterEditProfile />
        <InputBox>
          <label className='tit'>프로필 사진*</label>
          {console.log("imageUrl:", values.imageUrl)}
          <ImageRegist
            name={'imageUrl'}
            value={data && values.imageUrl}
            onChange={(e)=>{
              handleFileChange(e);
              if(e.target.files[0]) toggleErrorMessage('imageUrl', false);
            }}
            setValues={setValues}
          />
          {
            errorMessages.imageUrl && <Message>프로필 사진을 등록해주세요.</Message>
          }
        </InputBox>
        <InputBox>
          <label className='tit'>대표 활동 사진*</label>
          {console.log("mainImageUrl:", values.mainImageUrl)}
          <ImageRegist
            name={'mainImageUrl'}
            value={data && values.mainImageUrl}
            onChange={(e)=>{
              handleFileChange(e);
              if(e.target.files[0]) toggleErrorMessage('mainImageUrl', false);
            }}
            setValues={setValues}
          />
          {
            errorMessages.mainImageUrl && <Message>대표 활동 사진을 등록해주세요.</Message>
          }
        </InputBox>
        <InputBox>
          <label className='tit'>소개 타이틀* (30자 제한)</label>
          <input
            type='text'
            name='introTitle'
            onChange={(e)=>{
              handleInputChange(e);
              if(e.target.value.trim().length > 0) toggleErrorMessage('introTitle', false);
            }}
            defaultValue={data && values.introTitle}
            placeholder='소개 타이틀을 작성해 주세요.'
          />
          {
            errorMessages.introTitle && <Message>소개 타이틀을 입력해주세요.</Message>
          }
        </InputBox>
        <InputBox>
          <label className='tit'>자기 소개글* (1,000자 제한)</label>
          <textarea
            type='text'
            name='myIntro'
            onChange={(e)=>{
              handleInputChange(e);
              if(e.target.value.trim().length > 0) toggleErrorMessage('myIntro', false);
            }}
            defaultValue={data && values.myIntro}
            placeholder='자신을 소개해 주세요'
          />
          {
            errorMessages.myIntro && <Message>자기 소개글을 입력해주세요.</Message>
          }
        </InputBox>
        {update ? (
          <StyledButton
          _onClick={() => navigate('/mypage/SitterProfileForm3', {state: { data: values, update: true }})}
          _title={'다음으로'}
        />
        ) : (
          <StyledButton
            _onClick={() =>
              navigate("/mypage/SitterProfileForm3", {
                state: { data: values, update: false },
              })
            }
            _title={"다음으로"}
          />
        )}
      </SitterProfileFormInner>
    </StyledContainer>
  );
};

const SitterProfileFormInner = styled.div`
  input[type='text'] {
    width: 100%;
    min-height: 48px;
    background: #ffffff;
    border: 1px solid rgba(120, 120, 120, 0.4);
    border-radius: 6px;
    padding: 12px;
  }

  textarea {
    width: 100%;
    min-height: 166px;
    background: #ffffff;
    border: 1px solid rgba(120, 120, 120, 0.4);
    border-radius: 6px;
    padding: 12px;
  }
`;
const Message = styled.p`
  font-size: 13px;
  align-self: flex-start;
  padding: 5px 0;
  color: #F01D1D;
`;
export default SitterProfileForm2;
