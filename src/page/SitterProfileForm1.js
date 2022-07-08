import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AddressInfo from "../components/AddressInfo";

const INITIAL_VALUES = {
  userName: "",
  gender: "Man",
  address: "",
  detailAddress: "",
  region_1depth_name: "",
  region_2depth_name: "",
  region_3depth_name: "",
  x: "",
  y: "",
  imageUrl: "",
  mainImageUrl: "",
  introTitle: "",
  myIntro: "",
  careSize: [],
  category: [],
  plusService: [],
  noDate: [],
  servicePrice: 0,
};

const SitterProfileForm1 = () => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [gender, setGender] = useState(false);

  const handleChange = (name, value) => {
    setValues((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  const handleClickRadioButton = (e) => {
    const { name, value, id } = e.target;
    setGender(Boolean(Number(value)));
    handleChange(name, id);
  };

  const handleInputChange = (e) => {
    const [name, value] = e.target;
    handleChange(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(gender);
    console.log(values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>
        돌보미 등록<span>1/4</span>
      </h1>
      <div>
        <p className="tit">이름</p>
        <input type="text" />
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
        _zonecode={values.zonecode}
        _name={"detailAddress"}
        onChange={handleInputChange}
      />
      <button>전송</button>
    </Form>
  );
};

const Form = styled.form`
  input,
  textarea {
    border: 1px solid #000;
  }
`;
export default SitterProfileForm1;
