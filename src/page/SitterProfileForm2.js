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

  
  const [errorMessage, setErrorMessage] = useState({
    imageUrl: false,
    mainImageUrl: false,
    introTitle: false,
    myIntro: false,
  })

  const doValidation = () => {
    let emptyLength = Object.keys(errorMessage).length;
    for(let i=0; i<Object.keys(errorMessage).length; i++){
      console.log(values)
      if(!values[Object.keys(errorMessage)[i]] || values[Object.keys(errorMessage)[i]].trim().length <= 0) {
        setErrorMessage((prev)=>{
          const error = {...prev};
          error[Object.keys(errorMessage)[i]] = true;
          return error;
        })
      }else{
        setErrorMessage((prev)=>{
          const error = {...prev};
          error[Object.keys(errorMessage)[i]] = false;
          return error;
        })
        emptyLength--;
      }
    }
    if(emptyLength === 0){
      navigate('/mypage/SitterProfileForm3', {state: { data: values, update: true }});
    }
  }


  useEffect(() => {
    console.log(values);
  }, []);

  return (
    <StyledContainer>
      <SitterProfileFormInner>
        <NavBox _title='상세 정보' _subTitle='2/4' sitterProfile />
        <InputBox>
          <label className='tit'>프로필 사진*</label>
          <ImageRegist
            name={'imageUrl'}
            value={data && values.imageUrl}
            onChange={(e)=>{
              handleFileChange(e);
              if(e.target.files[0]){
                setErrorMessage((prev)=>{
                  const data = {...prev};
                  data.imageUrl = true;
                  return data;
                })
              }
            }}
          />
          {
            errorMessage.imageUrl && <Message>프로필 사진을 등록해주세요.</Message>
          }
        </InputBox>
        <InputBox>
          <label className='tit'>대표 활동 사진*</label>
          <ImageRegist
            name={'mainImageUrl'}
            value={data && values.mainImageUrl}
            onChange={(e)=>{
              handleFileChange();
              if(e.target.files[0]){
                setErrorMessage((prev)=>{
                  const data = {...prev};
                  data.mainImageUrl = true;
                  return data;
                })
              }
            }}
          />
          {
            errorMessage.mainImageUrl && <Message>대표 활동 사진을 등록해주세요.</Message>
          }
        </InputBox>
        <InputBox>
          <label className='tit'>소개 타이틀 (30자 제한)</label>
          <input
            type='text'
            name='introTitle'
            onChange={(e)=>{
              handleInputChange(e);
              if(e.target.value.trim().length > 0){
                setErrorMessage((prev)=>{
                  const data = {...prev};
                  data.myIntro = true;
                  return data;
                })
              }
            }}
            defaultValue={data && values.introTitle}
            placeholder='소개 타이틀을 작성해 주세요.'
          />
          {
            errorMessage.introTitle && <Message>소개 타이틀을 입력해주세요.</Message>
          }
        </InputBox>
        <InputBox>
          <label className='tit'>자기 소개글 (1,000자 제한)</label>
          <textarea
            type='text'
            name='myIntro'
            onChange={(e)=>{
              handleInputChange(e);
              if(e.target.value.trim().length > 0){
                setErrorMessage((prev)=>{
                  const data = {...prev};
                  data.myIntro = true;
                  return data;
                })
              }
            }}
            defaultValue={data && values.myIntro}
            placeholder='자신을 소개해 주세요'
          />
          {
            errorMessage.introTitle && <Message>자기 소개글을 입력해주세요.</Message>
          }
        </InputBox>
        <StyledButton
          _onClick={doValidation}
          _title={'다음으로'}
        />
        {update ? (
          <Link
            to={`/mypage/SitterProfileForm3`}
            state={{ data: values, update: true }}
          >
            <button>다음 true</button>
          </Link>
        ) : (
          <Link
            to={`/mypage/SitterProfileForm3`}
            state={{ data: values, update: false }}
          >
            <button>다음 false</button>
          </Link>
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
