import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { handleChange } from "../shared/common";
import ImageRegist from "../components/ImageRegist"

const INITIAL_VALUES = {
  imageUrl: "",
  mainImageUrl: "",
  introTitle: "",
  myIntro: "",
};

const SitterProfileForm2 = () => {
  const { data } = useLocation().state;
  const [values, setValues] = useState({ ...data, ...INITIAL_VALUES });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

  const onSubmitTest = () => {
    console.log(values);
  };

  return (
    <SitterProfileFormInner>
      <h1>
        돌보미 등록<span>2/4</span>
      </h1>
      <div>
        <p className="tit">돌보미 프로필 사진</p>
        <ImageRegist name={"imageUrl"} value={values.imageUrl} onChange={handleInputChange}/>
      </div>
      <div>
        <p className="tit">대표 이미지 (최대 1장)</p>
        <ImageRegist name={"mainImageUrl"} value={values.mainImageUrl} onChange={handleInputChange}/>
      </div>

      <button onClick={onSubmitTest}>다음</button>
      {/* <Link to={`/mypage/SitterProfileForm3`} state={{ data: values }}>
        <button onClick={onSubmitTest}>다음</button>
      </Link> */}
    </SitterProfileFormInner>
  );
};

const SitterProfileFormInner = styled.div`
  input,
  textarea {
    border: 1px solid #000;
  }
`;
export default SitterProfileForm2;
