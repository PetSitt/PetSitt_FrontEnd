import React, { useState, useEffect } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AddressInfo from "../components/AddressInfo";
import KakaoMapContainer from "../components/KakaoMapContainer";
import { handleChange } from "../shared/common";

const INITIAL_VALUES = {
  userName: "",
  gender: "Man",
  address: "",
  detailAddress: "",
  region_1depth_name: "",
  region_2depth_name: "",
  region_3depth_name: "",
  zoneCode: "",
  x: "",
  y: "",
};

const SitterProfileForm1 = () => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [gender, setGender] = useState(false);
  const open = useDaumPostcodePopup(
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  //주소 입력 우편번호 함수
  const handlePostcode = (data) => {
    const { zonecode, sido, sigungu, query } = data;
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    handleChange("address", fullAddress, setValues);
    handleChange("zoneCode", zonecode, setValues);
    handleChange("region_1depth_name", sido, setValues);
    handleChange("region_2depth_name", sigungu, setValues);
    handleChange("region_3depth_name", query, setValues);
  };
  const handlePost = () => {
    open({ onComplete: handlePostcode });
  };

  const handleClickRadioButton = (e) => {
    const { name, value, id } = e.target;
    setGender(Boolean(Number(value)));
    handleChange(name, id, setValues);
  };

  const handleGeolocation = (name, value) => {
    handleChange(name, value, setValues);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

  return (
    <SitterProfileFormInner>
      <KakaoMapContainer
        address={values.address}
        onChange={handleGeolocation}
      ></KakaoMapContainer>
      <h1>
        돌보미 등록<span>1/4</span>
      </h1>
      <div>
        <p className="tit">이름</p>
        <input type="text" name="userName" onChange={handleInputChange} />
      </div>
      <div>
        <p className="tit">성별</p>
        <input
          id="Man"
          value={1}
          type="radio"
          name="gender"
          defaultChecked={values.gender === "Man" && true}
          onChange={handleClickRadioButton}
        />
        <label htmlFor="Man">남</label>

        <input
          id="WoMan"
          value={0}
          type="radio"
          name="gender"
          defaultChecked={values.gender === "WoMan" && true}
          onChange={handleClickRadioButton}
        />
        <label htmlFor="WoMan">여</label>
      </div>
      <AddressInfo
        _address={values.address}
        _zonecode={values.zoneCode}
        detailAddress={values.detailAddress}
        onChange={handleInputChange}
        handlePost={handlePost}
      />
      <Link to={`/mypage/SitterProfileForm2`} state={{ data: values }}>
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
export default SitterProfileForm1;
