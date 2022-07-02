import { useState } from "react";
import Input from '../elements/Input';
import Button from "../elements/Button";
import Checkbox from "../elements/Checkbox";

const INITIAL_VALUES = [false, false, false];

function SitterProfileForm1() {
  const [checkedInputs, setCheckedInputs] = useState([]);
  const [isChecked, setIsChecked] = useState(INITIAL_VALUES);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter((el) => el !== id));
    }
  };


  return (
    <div>
      <h1>돌보미 등록<span>3/4</span></h1>

      <Checkbox _id={"소형견"} _text={"소형견"} _size={"1.2rem"} onChange={changeHandler} checked={checkedInputs} />
      <Checkbox _id={"중형견"} _text={"중형견"} _size={"1.2rem"} onChange={changeHandler} checked={checkedInputs} />
      <Checkbox _id={"대형견"} _text={"대형견"} _size={"1.2rem"} onChange={changeHandler} checked={checkedInputs} />
      
      <Checkbox _text={"소형견"} _size={"1.2rem"} onChange={(e) => {
        setIsChecked((prev) => {
          const newData = [...prev];
          newData[0] = e.target.checked;
          return newData;
        })
      }} checked={isChecked} />
      <Checkbox _text={"중형견"} _size={"1.2rem"} onChange={(e) => {
        setIsChecked((prev) => {
          const newData = [...prev];
          newData[1] = e.target.checked;
          return newData;
        })
      }} checked={isChecked} />
      <Checkbox _text={"대형견"} _size={"1.2rem"} onChange={(e) => {
        setIsChecked((prev) => {
          const newData = [...prev];
          newData[2] = e.target.checked;
          return newData;
        })
      }} checked={isChecked} />


      <Input _width={"100%"} _placeholder={"아이디(이메일)"} _required={"required"} />
      <Button _color={"#fff"}>버튼2</Button>
    </div>
  );
}

export default SitterProfileForm1;