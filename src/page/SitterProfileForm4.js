import Button from "../elements/Button";
import styled from "styled-components";
import { Calendar, DateObject } from "react-multi-date-picker"
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";


const format = "YYYY/MM/DD/";
const INITIAL_VALUES = {
  noDate: []
};

function SitterProfileForm4() {
  const { data } = useLocation().state;
  const [values, setValues] = useState({...data, ...INITIAL_VALUES});
  const [dates, setDates] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const noDate = dates.map((el) => el.format());
    setValues((prevValues) => {
      return {...prevValues, noDate}
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1>돌보미 등록<span>4/4</span></h1>
      <Calendar multiple sort format={format} value={dates} onChange={setDates}></Calendar>
      <ul>
        {values.noDate.map((date, index) => (
          <li key={index}>{date}</li>
        ))}
      </ul>
      
      <Button _color={"#fff"}>등록하기</Button>
    </Form>
  );
}

const Form = styled.form`
  input,
  textarea {
    border: 1px solid #000;
  }
`;

export default SitterProfileForm4;