import { useState } from "react";
import Button from "../elements/Button";
import Checkbox from "../elements/Checkbox";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { handleChange } from "../shared/common";

const INITIAL_VALUES = {
  careSize: [false, false, false],
  category: [],
  plusService: [],
  servicePrice: 0
};

function SitterProfileForm3() {
  const { data } = useLocation().state;

  const [available, setAvailable] = useState([]);
  const [addService, setAddService] = useState([]);
  const [values, setValues] = useState({...data, ...INITIAL_VALUES});

  const availableHandler = (checked, id) => {
    if (checked) {
      setAvailable([...available, id]);
      setValues((preve) => {
        const category = [...preve.category, id];
        return {...preve, category}
      });
    } else {
      setAvailable(available.filter((el) => el !== id));
      setValues((preve) => {
        const category = preve.category.filter(function(el) {
          return el !== id
        });
        return {...preve, category}
      });
    }
  }

  const addServiceHandler = (checked, id) => {
    if (checked) {
      setAddService([...addService, id]);
      setValues((preve) => {
        const plusService = [...preve.plusService, id];
        return {...preve, plusService}
      });
    } else {
      setAddService(addService.filter((el) => el !== id));
      setValues((preve) => {
        const plusService = preve.plusService.filter(function(el) {
          return el !== id
        });
        return {...preve, plusService}
      });
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

  return (
    <SitterProfileFormInner>
      <h1>돌보미 등록<span>3/4</span></h1>
      <div>
        <p className="tit">케어 가능 범위</p>
     
        <Checkbox _text={"소형견"} _size={"1.2rem"} onChange={(e) => {
          setValues((prevValues) => {
            const careSize = [...prevValues.careSize];
            careSize[0] = e.target.checked;
            return {...prevValues, careSize}
          })
        }} checked={values.careSize} />
        <Checkbox _text={"중형견"} _size={"1.2rem"} onChange={(e) => {
          setValues((prevValues) => {
            const careSize = [...prevValues.careSize];
            careSize[1] = e.target.checked;
            return {...prevValues, careSize}
          })
        }} checked={values.careSize} />
        <Checkbox _text={"대형견"} _size={"1.2rem"} onChange={(e) => {
          setValues((prevValues) => {
            const careSize = [...prevValues.careSize];
            careSize[2] = e.target.checked;
            return {...prevValues, careSize}
          })
        }} checked={values.careSize} />
      </div>
      
      <div>
        <p className="tit">제공 가능한 서비스*</p>
        <div>
          <Checkbox _id={"산책"} _text={"산책"} _size={"1.2rem"} onChange={availableHandler} checked={available} />
          <Checkbox _id={"목욕, 모발 관리"} _text={"목욕, 모발 관리"} _size={"1.2rem"} onChange={availableHandler} checked={available} />
          <Checkbox _id={"훈련"} _text={"훈련"} _size={"1.2rem"} onChange={availableHandler} checked={available} />
          <Checkbox _id={"데이 케어 - 시터 집"} _text={"데이 케어 - 시터 집"} _size={"1.2rem"} onChange={availableHandler} checked={available} />
          <Checkbox _id={"1박 케어 - 시터 집"} _text={"1박 케어 - 시터 집"} _size={"1.2rem"} onChange={availableHandler} checked={available} />
        </div>
      </div>

      <div>
        <p className="tit">추가 가능한 서비스*</p>
        <div>
          <Checkbox _id={"(자동차 그림) 집앞 픽업 가능 - 비용은 펫시터와 협의"} _text={"(자동차 그림) 집앞 픽업 가능 - 비용은 펫시터와 협의"} _size={"1.2rem"} onChange={addServiceHandler} checked={addService} />
          <Checkbox _id={"응급 처치"} _text={"응급 처치"} _size={"1.2rem"} onChange={addServiceHandler} checked={addService} />
          <Checkbox _id={"장기 예약 가능 - 14일 이상 돌봄가능"} _text={"장기 예약 가능 - 14일 이상 돌봄가능"} _size={"1.2rem"} onChange={addServiceHandler} checked={addService} />
          <Checkbox _id={"퍼피 케어(1살미만)"} _text={"퍼피 케어(1살미만)"} _size={"1.2rem"} onChange={addServiceHandler} checked={addService} />
          <Checkbox _id={"노견 케어(8살이상)"} _text={"노견 케어(8살이상)"} _size={"1.2rem"} onChange={addServiceHandler} checked={addService} />
          <Checkbox _id={"실내놀이"} _text={"실내놀이"} _size={"1.2rem"} onChange={addServiceHandler} checked={addService} />
          <Checkbox _id={"마당있음"} _text={"마당있음"} _size={"1.2rem"} onChange={addServiceHandler} checked={addService} />
        </div>
      </div>

      <div>
        <p className="tit">금연*</p>
        <p className="txt">일당 서비스 금액을 입력해주세요.</p>
        <div>
          <input type="text" name="servicePrice" onChange={handleInput} />
        </div>
      </div>

      <Link to={`/mypage/SitterProfileForm4`} state={{ data: values }}>
        <button>다음</button>
      </Link>
    </SitterProfileFormInner>
  );
}

const SitterProfileFormInner = styled.div`
  input,
  textarea {
    border: 1px solid #000;
  }
`;

export default SitterProfileForm3;