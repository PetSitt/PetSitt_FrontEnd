import Button from "../elements/Button";
import styled from "styled-components";
import { Calendar, DateObject } from "react-multi-date-picker"
import { useState } from "react";

const format = "YYYY/MM/DD/";

function SitterProfileForm4() {
  const [value, setValue] = useState([
    new DateObject().set({ day: 4, format }),
    new DateObject().set({ day: 25, format }),
    new DateObject().set({ day: 20, format })
  ]);

  const onSubmitTest = () => {
    console.log(value)
  };

  return (
    <SitterProfileFormInner>
      <h1>돌보미 등록<span>4/4</span></h1>
      <Calendar value={value} onChange={setValue}></Calendar>
      <ul>
        {value.map((date, index) => (
          <li key={index}>{date.format()}</li>
        ))}
      </ul>
      
      <Button _color={"#fff"} onClick={onSubmitTest}>등록하기</Button>
    </SitterProfileFormInner>
  );
}

const SitterProfileFormInner = styled.div`
  input,
  textarea {
    border: 1px solid #000;
  }
`;

export default SitterProfileForm4;