import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
            onChange={handleFileChange}
          />
        </InputBox>
        <InputBox>
          <label className='tit'>대표 활동 사진*</label>
          <ImageRegist
            name={'mainImageUrl'}
            value={data && values.mainImageUrl}
            onChange={handleFileChange}
          />
        </InputBox>
        <InputBox>
          <label className='tit'>소개 타이틀 (30자 제한)</label>
          <input
            type='text'
            name='introTitle'
            onChange={handleInputChange}
            defaultValue={data && values.introTitle}
            placeholder='소개 타이틀을 작성해 주세요.'
          />
        </InputBox>
        <InputBox>
          <label className='tit'>자기 소개글 (1,000자 제한)</label>
          <textarea
            type='text'
            name='myIntro'
            onChange={handleInputChange}
            defaultValue={data && values.myIntro}
            placeholder='자신을 소개해 주세요'
          />
        </InputBox>
        <StyledButton
          _onClick={() => console.log('다음으로')}
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
export default SitterProfileForm2;
