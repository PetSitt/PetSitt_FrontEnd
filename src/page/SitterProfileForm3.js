import { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Checkbox from '../elements/Checkbox';
import { handleChange, comma, uncomma } from '../shared/common';
import { useEffect } from 'react';
import NavBox from '../elements/NavBox';
import StyledContainer from '../elements/StyledContainer';
import InputBox from '../elements/InputBox';
import StyledButton from '../elements/StyledButton';

const INITIAL_VALUES = {
  careSize: [false, false, false],
  category: [],
  plusService: [],
  servicePrice: "",
};


function SitterProfileForm3() {
  const navigate = useNavigate();
  const { data, update } = useLocation().state;
  const [available, setAvailable] = useState([]);
  const [num, setNum] = useState("");
  const [values, setValues] = useState(
    update ? data : { ...data, ...INITIAL_VALUES }
  );
  console.log(values)

  /** 채크박스에 항목 id의 값을 배열로 만들어서 values에 저장 */
  const availableHandler = (checked, key, id) => {
    if (checked) {
      setAvailable([...available, id]);
      setValues((preve) => {
        const value = [...preve[key], id];
        return { ...preve, [key]: value };
      });
    } else {
      setAvailable(available.filter((el) => el !== id));
      setValues((preve) => {
        const value = preve[key].filter((el) => el !== id);
        return { ...preve, [key]: value };
      });
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    handleChange(name, uncomma(value), setValues);
    return setNum(comma(uncomma(value)));
  };
  

  useEffect(() => {
    console.log(values);
  }, []);

  const [errorMessages, setErrorMessage] = useState({
    category: false,
    servicePrice: false,
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
      if(!values[Object.keys(errorMessages)[i]] || values[Object.keys(errorMessages)[i]] === '' || values[Object.keys(errorMessages)[i]]?.length <= 0){
        toggleErrorMessage(Object.keys(errorMessages)[i], true);
        emptyLength++;
      }else{
        toggleErrorMessage(Object.keys(errorMessages)[i], false);
      }
    }
    if(emptyLength === 0){
      navigate('/mypage/SitterProfileForm4', {state: { data: values, update: update ? true : false }});
    }
  }

  return (
    <StyledContainer>
      <SitterProfileFormInner>
        <NavBox _title="제공 가능한 서비스" _subTitle="3/4" sitterEditProfile />
        <CheckWrap>
          <label className="tit">케어 가능 범위*</label>
          <CheckGroup>
            <Checkbox
              _text={"소형견"}
              _size={"1.2rem"}
              _border={"1px solid rgba(120, 120, 120, 0.7)"}
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
              _text={"중형견"}
              _size={"1.2rem"}
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
              _text={"대형견"}
              _size={"1.2rem"}
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
        <CheckWrap>
          <label className="tit">제공 가능한 서비스*</label>
          <CheckGroup>
            <Checkbox
              _id={"산책"}
              _key={"category"}
              _text={"산책"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.category}
            />
            <Checkbox
              _id={"목욕 및 모발 관리"}
              _key={"category"}
              _text={"목욕 및 모발 관리"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.category}
            />
            <Checkbox
              _id={"훈련"}
              _key={"category"}
              _text={"훈련"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.category}
            />
            <Checkbox
              _id={"데이케어"}
              _key={"category"}
              _text={"데이케어"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.category}
            />
            <Checkbox
              _id={"1박케어"}
              _key={"category"}
              _text={"1박케어"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.category}
            />
          </CheckGroup>
          {
            errorMessages.category && <Message>제공 가능한 서비스를 한 개 이상 선택해주세요.</Message>
          }
        </CheckWrap>
        <CheckWrap>
          <label className='tit'>추가 가능한 서비스</label>
          <CheckGroup>
            <Checkbox
              _id={'집앞 픽업 가능 - 비용은 펫시터와 협의'}
              _key={'plusService'}
              _text={'집앞 픽업 가능 - 비용은 펫시터와 협의'}
              _size={'1.2rem'}
              onChange={availableHandler}
              checked={values.plusService}
            />
            <Checkbox
              _id={"응급 처치"}
              _key={"plusService"}
              _text={"응급 처치"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.plusService}
            />
            <Checkbox
              _id={"장기 예약 가능 - 14일 이상 돌봄가능"}
              _key={"plusService"}
              _text={"장기 예약 가능 - 14일 이상 돌봄가능"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.plusService}
            />
            <Checkbox
              _id={"퍼피 케어(1살미만)"}
              _key={"plusService"}
              _text={"퍼피 케어(1살미만)"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.plusService}
            />
            <Checkbox
              _id={"노견 케어(8살이상)"}
              _key={"plusService"}
              _text={"노견 케어(8살이상)"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.plusService}
            />
            <Checkbox
              _id={"실내놀이"}
              _key={"plusService"}
              _text={"실내놀이"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.plusService}
            />
            <Checkbox
              _id={"마당있음"}
              _key={"plusService"}
              _text={"마당있음"}
              _size={"1.2rem"}
              onChange={availableHandler}
              checked={values.plusService}
            />
          </CheckGroup>
        </CheckWrap>
        <InputBox>
        <label className='txt'>서비스 금액 *</label>
          <input
            type="text"
            name="servicePrice"
            placeholder="일당 서비스 금액을 입력해주세요."
            value={num ? num : comma(values.servicePrice)}
            onChange={handleInput}
          />
          {
            errorMessages.servicePrice && <Message>일당 서비스 금액을 입력해주세요.</Message>
          }
        </InputBox>
        <StyledButton
          _onClick={doValidation}
          _title={'다음으로'}
        />
      </SitterProfileFormInner>
    </StyledContainer>
  );
}

const SitterProfileFormInner = styled.div`
  input,
  textarea {
    border: 1px solid rgba(120, 120, 120, 0.7);
  }

  input[type='text'],
  input[type='number'] {
    width: 100%;
    min-height: 48px;
    background: #ffffff;
    border: 1px solid rgba(120, 120, 120, 0.4);
    border-radius: 6px;
    padding: 12px;
  }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
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

const Message = styled.p`
  font-size: 13px;
  align-self: flex-start;
  padding: 5px 0;
  color: #F01D1D;
`;
export default SitterProfileForm3;
