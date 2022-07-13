import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    handleChange(name, files[0], setValues);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

  return (
    <SitterProfileFormInner>
      <h1>
        돌보미 등록<span>2/4</span>
      </h1>
      <div>
        <p className="tit">돌보미 프로필 사진</p>
        <ImageRegist name={"imageUrl"} value={values.imageUrl} onChange={handleFileChange}/>
      </div>
      <div>
        <p className="tit">대표 이미지 (최대 1장)</p>
        <ImageRegist name={"mainImageUrl"} value={values.mainImageUrl} onChange={handleFileChange}/>
      </div>
      <div>
        <p className="tit">소개 타이틀 (30자 제한)</p>
        <input type="text" name="introTitle" onChange={handleInputChange} />
      </div>
      <div>
        <p className="tit">자기 소개글 (1000자 제한)</p>
        <textarea type="text" name="myIntro" onChange={handleInputChange}></textarea>
      </div>

      <Link to={`/mypage/SitterProfileForm3`} state={{ data: values }}>
        <button>다음</button>
      </Link>
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
