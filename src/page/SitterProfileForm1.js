import React, { useEffect, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import AddressInfo from "../components/AddressInfo";
import KakaoMapContainer from "../components/KakaoMapContainer";
import { handleChange } from "../shared/common";

const INITIAL_VALUES = {
  userName: "",
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
  const location = useLocation();
  const data = location.state;
  const [values, setValues] = useState(data ? data.data : INITIAL_VALUES);
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

  const handleGeolocation = (name, value) => {
    handleChange(name, value, setValues);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };
  
  useEffect(() => {
    console.log(values)
  },[])

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
        <input type="text" name="userName" onChange={handleInputChange} defaultValue={values.userName} />
      </div>
      <AddressInfo
        _address={values.address}
        _zonecode={values.zoneCode}
        detailAddress={values.detailAddress}
        onChange={handleInputChange}
        handlePost={handlePost}
      />

      {
        data ? (
          <Link to={`/mypage/SitterProfileForm2`} state={{ data: values, update: true }}>
            <button>다음 true</button>
          </Link>
        ) : (
          <Link to={`/mypage/SitterProfileForm2`} state={{ data: values, update: false }}>
            <button>다음 false</button>
          </Link>
        )
      }
      

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
