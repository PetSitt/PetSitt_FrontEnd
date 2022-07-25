import React from 'react';
import styled from 'styled-components';
import Input from '../elements/Input';

const AddressInfo = ({
  _address,
  _zonecode,
  detailAddress,
  handlePost,
  onChange,
}) => {
  return (
    <ContensInner className={'contents'}>
      <div className='postNumber box'>
        <Input
          _type='text'
          _placeholder={'우편번호'}
          defaultValue={_zonecode}
          onChange={onChange}
        />
        <div className='postLink' onClick={handlePost}>
          우편번호
        </div>
      </div>
      <div className='box'>
        <Input
          _type='text'
          _placeholder={'주소'}
          defaultValue={_address}
          onChange={onChange}
        />
      </div>
      <div className='box'>
        <Input
          _name='detailAddress'
          _type='text'
          _placeholder={'상세주소'}
          defaultValue={detailAddress}
          onChange={onChange}
        >
          상세주소
        </Input>
      </div>
    </ContensInner>
  );
};

const ContensInner = styled.div`
  div {
    margin-bottom: 10px;
  }
  .postNumber {
    display: flex;
    justify-content: center;
    align-items: center;
    .inputBx {
      flex-shrink: 1;
    }
    .postLink {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 100px;
      height: 48px;
      background: #ffffff;
      border: 1px solid rgba(120, 120, 120, 0.4);
      border-radius: 6px;
      margin-left: 4px;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      color: #676767;
      margin-top: 3px;
    }
  }
`;

export default AddressInfo;
