import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Calendar, DateObject } from 'react-multi-date-picker';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apis } from '../store/api';
import { comma } from '../shared/common';
import Input from '../elements/Input';
import NavBox from '../elements/NavBox';
import Checkbox from '../elements/Checkbox';

const SitterProfile = () => {
  const navigate = useNavigate();
  const today = new DateObject();
  const queryClient = useQueryClient();
  const [caresizeData, setCaresizeData] = useState([
    '소형견',
    '중형견',
    '대형견',
  ]);
  const { data: sitterData, isSuccess: sitterSuccessGet } = useQuery(
    'sitterprofile',
    apis.sitterprofileGet
  );
  const [values, setValues] = useState(sitterData.data.sitterprofile);
  const { mutate: delect, isSuccess: sitterSuccessDelete } = useMutation(
    apis.sitterprofileDelete,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sitterprofile');
      },
      onError: (data) => {
        console.log(data, 'error');
      },
    }
  );

  useEffect(() => {
    (sitterSuccessGet || sitterSuccessDelete) &&
      setValues(sitterData.data.sitterprofile);
  }, [sitterSuccessGet, sitterSuccessDelete, sitterData]);

  return (
    <SitterProfileInner>
      <NavBox
        _title='돌보미 프로필'
        _onClick={() => {
          navigate('/mypage/SitterProfileForm1', { state: values });
        }}
        _buttonTitle='수정'
        sitterProfile
      />
      {values && <button onClick={delect}>삭제</button>}
      {console.log(values)}
      {
        values ? (
        <div>
          <div className="profileinner">
            <div className="profileMainImg inner">
              <img src={values.mainImageUrl} />
            </div>
            <div className="inner">
              <h3 className="tit">이름</h3>
              <p>{comma(values.sitterName)}</p>
            </div>
            <div className="profileFee inner">
              <h3 className="tit">요금</h3>
              <p>{comma(values.servicePrice)}</p>
            </div>
            <div className="inner">
              <h3 className="tit">제공가능한 서비스</h3>
              {values.category.map((el, idx) => {
                return(el && <div key={idx}>{el}</div>)
              })}
            </div>
            <div className="inner">
              <h3 className="tit">케어 가능한 범위</h3>
              {values.careSize.map((el, idx) => {
                return(el && <div key={idx}>{caresizeData[idx]}</div>)
              })}
            </div>
            <div className="inner">
              <h3 className="tit">제공 가능한 서비스</h3>
              {values.category.map((el, idx) => {
                return(<div key={idx}>{el}</div>)
              })}
            </div>
            <div className="inner">
              <h3 className="tit">추가 가능한 서비스</h3>
              {values.plusService.map((el, idx) => {
                return(<div key={idx}>{el}</div>)
              })}
            </div>
            <div className="inner">
              <h3 className="tit">서비스 가능한 날짜</h3>
              <Calendar value={values.noDate} readOnly={true} minDate={new Date()} maxDate={new Date(today.year + 1, today.month.number, today.day)}></Calendar>
            </div>
          </div>
          <label className='inner required'>
            <p className='tit'>요금</p>
            <Input
              _width='100%'
              _height='44px'
              _type='text'
              defaultValue={comma(values.servicePrice)}
              disabled
            />
          </label>
          <CheckWrap>
            <label className='tit'>제공 가능한 서비스</label>
            <CheckGroup>
              <Checkbox
                _id={'산책'}
                _key={'category'}
                _text={'산책'}
                _size={'1.2rem'}
                checked={values.category}
              />
              <Checkbox
                _id={'목욕, 모발 관리'}
                _key={'category'}
                _text={'목욕, 모발 관리'}
                _size={'1.2rem'}
                checked={values.category}
              />
              <Checkbox
                _id={'훈련'}
                _key={'category'}
                _text={'훈련'}
                _size={'1.2rem'}
                checked={values.category}
              />
              <Checkbox
                _id={'데이 케어'}
                _key={'category'}
                _text={'데이 케어'}
                _size={'1.2rem'}
                checked={values.category}
              />
              <Checkbox
                _id={'1박 케어'}
                _key={'category'}
                _text={'1박 케어'}
                _size={'1.2rem'}
                checked={values.category}
              />
            </CheckGroup>
          </CheckWrap>
          <CheckWrap>
            <label className='tit'>케어 가능 범위</label>
            <CheckGroup>
              <Checkbox
                _text={'소형견'}
                _size={'1.2rem'}
                _border={'1px solid rgba(120, 120, 120, 0.7)'}
                onChange={(e) => {
                  setValues((prevValues) => {
                    const careSize = [...prevValues.careSize];
                    careSize[0] = e.target.checked;
                    return { ...prevValues, careSize };
                  });
                }}
                checked={values.careSize}
              />
              <Checkbox
                _text={'중형견'}
                _size={'1.2rem'}
                onChange={(e) => {
                  setValues((prevValues) => {
                    const careSize = [...prevValues.careSize];
                    careSize[1] = e.target.checked;
                    return { ...prevValues, careSize };
                  });
                }}
                checked={values.careSize}
              />
              <Checkbox
                _text={'대형견'}
                _size={'1.2rem'}
                onChange={(e) => {
                  setValues((prevValues) => {
                    const careSize = [...prevValues.careSize];
                    careSize[2] = e.target.checked;
                    return { ...prevValues, careSize };
                  });
                }}
                checked={values.careSize}
              />
            </CheckGroup>
          </CheckWrap>
          <div className='inner'>
            <h3 className='tit'>서비스 불가능한 날짜</h3>
            {console.log(values.noDate)}
            <Calendar
              value={values.noDate}
              readOnly={true}
              minDate={new Date()}
              maxDate={new Date(today.year + 1, today.month.number, today.day)}
            ></Calendar>
          </div>
        </div>
      ) : (
        <SitterProfileInsertBox>
          <h3>돌보미로 등록하세요</h3>
          <p>돌보미 프로필을 등록해보세요</p>
          <SitterProfileInsertButton
            onClick={() => {
              navigate('/mypage/SitterProfileForm1');
            }}
          >
            돌보미로 등록하기
          </SitterProfileInsertButton>
        </SitterProfileInsertBox>
      )}
    </SitterProfileInner>
  );
};

const SitterProfileInner = styled.div`
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
  .tit {
    font-size: 16px;
    line-height: 19px;
    padding-bottom: 7px;
    margin-top: 24px;
  }

  .profileMainImg {
    text-align: center;
    img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
    }
  }
`;

const SitterProfileInsertBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 180px;
  h3 {
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    padding-bottom: 16px;
  }

  p {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #676767;
    padding-bottom: 24px;
  }
`;

const SitterProfileInsertButton = styled.button`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  padding: 12px 20px;
  background: #ffffff;
  border: 1px solid #fc9215;
  border-radius: 54px;
  color: #fc9215;
`;

const CheckWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 24px;
  & label {
    font-size: 16px;
    line-height: 19px;
    padding-bottom: 7px;
  }
`;

const CheckGroup = styled.div`
  label {
    margin-right: 10px;
  }
`;

export default SitterProfile;
