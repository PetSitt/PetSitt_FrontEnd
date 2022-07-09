import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { handleChange } from "../shared/common";

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
        <p className="tit">이름</p>
        <input type="text" name="myIntro" onChange={handleInputChange} />
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
