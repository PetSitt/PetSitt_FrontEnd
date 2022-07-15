import { useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import CheckBox from "../elements/CheckBox";
import { handleChange, comma, uncomma } from "../shared/common";
import { useEffect } from "react";

const INITIAL_VALUES = {
  careSize: [false, false, false],
  category: [],
  plusService: [],
  servicePrice: '',
};

function SitterProfileForm3() {
  const {data, update} = useLocation().state;
  const [available, setAvailable] = useState([]);
  const [num, setNum] = useState('');
  const [values, setValues] = useState(update ? data : { ...data, ...INITIAL_VALUES });
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
    return setNum(comma(uncomma(value)))
  };

  useEffect(() => {
    console.log(values)
  },[])

  return (
    <SitterProfileFormInner>
      <h1>
        돌보미 등록<span>3/4</span>
      </h1>
      <div>
        <p className="tit">케어 가능 범위</p>
        <CheckBox
          _text={"소형견"}
          _size={"1.2rem"}
          onChange={(e) => {
            setValues((prevValues) => {
              const careSize = [...prevValues.careSize];
              careSize[0] = e.target.checked;
              return { ...prevValues, careSize };
            });
          }}
          
          checked={values.careSize}
        />
        <CheckBox
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
        <CheckBox
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
      </div>

      <div>
        <p className="tit">제공 가능한 서비스*</p>
        <div>
          <CheckBox _id={"산책"} _key={"category"} _text={"산책"} _size={"1.2rem"} onChange={availableHandler} checked={values.category}/>
          <CheckBox _id={"목욕, 모발 관리"} _key={"category"} _text={"목욕, 모발 관리"} _size={"1.2rem"} onChange={availableHandler} checked={values.category}/>
          <CheckBox _id={"훈련"} _key={"category"} _text={"훈련"} _size={"1.2rem"} onChange={availableHandler} checked={values.category}/>
          <CheckBox _id={"데이 케어"} _key={"category"} _text={"데이 케어"} _size={"1.2rem"} onChange={availableHandler} checked={values.category}/>
          <CheckBox _id={"1박 케어"} _key={"category"} _text={"1박 케어"} _size={"1.2rem"} onChange={availableHandler} checked={values.category}/>
        </div>
      </div>

      <div>
        <p className="tit">추가 가능한 서비스*</p>
        <div>
          <CheckBox
            _id={"(자동차 그림) 집앞 픽업 가능 - 비용은 펫시터와 협의"}
            _key={"plusService"}
            _text={"(자동차 그림) 집앞 픽업 가능 - 비용은 펫시터와 협의"}
            _size={"1.2rem"}
            onChange={availableHandler}
            checked={values.plusService}
          />
          <CheckBox
            _id={"응급 처치"}
            _key={"plusService"}
            _text={"응급 처치"}
            _size={"1.2rem"}
            onChange={availableHandler}
            checked={values.plusService}
          />
          <CheckBox
            _id={"장기 예약 가능 - 14일 이상 돌봄가능"}
            _key={"plusService"}
            _text={"장기 예약 가능 - 14일 이상 돌봄가능"}
            _size={"1.2rem"}
            onChange={availableHandler}
            checked={values.plusService}
          />
          <CheckBox
            _id={"퍼피 케어(1살미만)"}
            _key={"plusService"}
            _text={"퍼피 케어(1살미만)"}
            _size={"1.2rem"}
            onChange={availableHandler}
            checked={values.plusService}
          />
          <CheckBox
            _id={"노견 케어(8살이상)"}
            _key={"plusService"}
            _text={"노견 케어(8살이상)"}
            _size={"1.2rem"}
            onChange={availableHandler}
            checked={values.plusService}
          />
          <CheckBox
            _id={"실내놀이"}
            _key={"plusService"}
            _text={"실내놀이"}
            _size={"1.2rem"}
            onChange={availableHandler}
            checked={values.plusService}
          />
          <CheckBox
            _id={"마당있음"}
            _key={"plusService"}
            _text={"마당있음"}
            _size={"1.2rem"}
            onChange={availableHandler}
            checked={values.plusService}
          />
        </div>
      </div>

      <div>
        <p className="tit">금연*</p>
        <p className="txt">일당 서비스 금액을 입력해주세요.</p>
        <div>
          <input type="text" name="servicePrice" defaultValue={num ? num : comma(values.servicePrice)} onChange={handleInput} />
        </div>
      </div>

      {
        update ? (
          <Link to={`/mypage/SitterProfileForm4`} state={{ data: values, update: true }}>
            <button>다음 true</button>
          </Link>
        ) : (
          <Link to={`/mypage/SitterProfileForm4`} state={{ data: values, update: false }}>
            <button>다음 false</button>
          </Link>
        )
      }
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
