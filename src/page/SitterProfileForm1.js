import React, { useEffect, useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import AddressInfo from '../components/AddressInfo';
import KakaoMapContainer from '../components/KakaoMapContainer';
import InputBox from '../elements/InputBox';
import NavBox from '../elements/NavBox';
import StyledContainer from '../elements/StyledContainer';
import { handleChange } from '../shared/common';

const INITIAL_VALUES = {
  sitterName: '',
  address: '',
  detailAddress: '',
  region_1depth_name: '',
  region_2depth_name: '',
  region_3depth_name: '',
  zoneCode: '',
  x: '',
  y: '',
};

const SitterProfileForm1 = () => {
  const location = useLocation();
  const data = location.state;
  const [values, setValues] = useState(data ? data.data : INITIAL_VALUES);
  const [gender, setGender] = useState();
  const open = useDaumPostcodePopup(
    'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  );

  //주소 입력 우편번호 함수
  const handlePostcode = (data) => {
    const { zonecode, sido, sigungu, query } = data;
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    handleChange('address', fullAddress, setValues);
    handleChange('zoneCode', zonecode, setValues);
    handleChange('region_1depth_name', sido, setValues);
    handleChange('region_2depth_name', sigungu, setValues);
    handleChange('region_3depth_name', query, setValues);
  };
  const handlePost = () => {
    open({ onComplete: handlePostcode });
  };

  const handleGeolocation = (name, value) => {
    handleChange(name, value, setValues);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

  const handleClickRadioButton = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setGender(e.target.value);
  };

  useEffect(() => {
    console.log(values);
  }, []);

  return (
    <StyledContainer>
      <SitterProfileFormInner>
        <KakaoMapContainer
          address={values.address}
          onChange={handleGeolocation}
        />
        <NavBox _title='기본 프로필' _subTitle='1/4' sitterProfile />
        <InputBox>
          <label className='tit'>이름*</label>
          <input
            type='text'
            name='sitterName'
            placeholder='이름을 적어주세요.'
            onChange={handleInputChange}
            defaultValue={values.sitterName}
          />
        </InputBox>
        <RadioBox>
          <label className='tit'>성별*</label>
          <RadioGroup>
            <label htmlFor='male'>
              <input
                id='male'
                type='radio'
                value='male'
                name='male'
                checked={gender === 'male'}
                onChange={handleClickRadioButton}
              />
              남
            </label>
            <label htmlFor='female'>
              <input
                id='female'
                type='radio'
                value='female'
                name='female'
                checked={gender === 'female'}
                onChange={handleClickRadioButton}
              />
              여
            </label>
          </RadioGroup>
        </RadioBox>
        <InputBox>
          <label className='tit'>돌보미 지역*</label>
          <AddressInfo
            _address={values.address}
            _zonecode={values.zoneCode}
            detailAddress={values.detailAddress}
            onChange={handleInputChange}
            handlePost={handlePost}
          />
        </InputBox>
        {data ? (
          <Link
            to={`/mypage/SitterProfileForm2`}
            state={{ data: values, update: true }}
          >
            <button>다음 true</button>
          </Link>
        ) : (
          <Link
            to={`/mypage/SitterProfileForm2`}
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
`;

const RadioBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 24px;
`;

const RadioGroup = styled.div`
  margin-top: 10px;
  label {
    display: inline-block;
    width: 48%;
    text-align: center;
    background: #ffffff;
    border: 1px solid rgba(120, 120, 120, 0.4);
    border-radius: 6px;
    padding: 21px;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #676767;
    cursor: pointer;
    :first-child {
      margin-right: 10px;
    }
  }

  input[type='radio'] {
    display: none;
  }

  input[type='radio']:checked + label {
    background-color: #c4c4c4;
  }
`;

export default SitterProfileForm1;
