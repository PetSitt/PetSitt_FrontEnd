import React, { useEffect, useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import AddressInfo from '../components/AddressInfo';
// import KakaoMapContainer from '../components/KakaoMapContainer';
import InputBox from '../elements/InputBox';
import NavBox from '../elements/NavBox';
import StyledButton from '../elements/StyledButton';
import StyledContainer from '../elements/StyledContainer';
import { handleChange } from '../shared/common';
import axios from 'axios';

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

    const searchTxt = data.address;
    const config = { headers: {Authorization : `KakaoAK ${process.env.REACT_APP_KAKAO_RESTAPI}`}}; //인증키 정보
    const url = 'https://dapi.kakao.com/v2/local/search/address.json?query='+searchTxt; // url 및 키워드 담아 보냄
    axios.get(url, config).then(function(result) { // API호출
      if(result.data !== undefined || result.data !== null){
				if(result.data.documents[0].x && result.data.documents[0].y) {
          handleChange('x', result.data.documents[0].x, setValues);
          handleChange('y', result.data.documents[0].y, setValues);
				}
      }
    })

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

  useEffect(() => {
    console.log(values);
  }, []);

  return (
    <StyledContainer>
      <SitterProfileFormInner>
        {/* <KakaoMapContainer
          address={values.address}
          onChange={handleGeolocation}
        /> */}
        <NavBox _title='기본 프로필' _subTitle='1/4' sitterProfile />
        <InputBox>
          <label className='tit'>이름*</label>
          <input
            type='text'
            name='sitterName'
            placeholder='이름을 적어주세요.'
            onChange={handleInputChange}
            defaultValue={values.sitterName}
            required
          />
        </InputBox>
        <InputBox>
          <label className='tit'>돌보미 지역*</label>
          <AddressInfo
            _address={values.address}
            _zonecode={values.zoneCode}
            detailAddress={values.detailAddress}
            onChange={handleInputChange}
            handlePost={handlePost}
            required
          />
        </InputBox>
        <StyledButton
          _onClick={() => console.log('다음으로')}
          _title={'다음으로'}
        />
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

export default SitterProfileForm1;
