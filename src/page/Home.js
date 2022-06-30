import { useQuery } from "react-query";
import {apis} from '../store/api'
import Input from '../elements/Input';
import Button from "../elements/Button";
import Checkbox from "../elements/Checkbox";
import { useEffect, useState } from "react";
import {getLocation} from './GetLocation';

function Home() {
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(function(pos) {
        console.log(pos);
        var latitude = pos.coords.latitude;
        var longitude = pos.coords.longitude;
        alert("현재 위치는 : " + latitude + ", "+ longitude);
    });
  },[])
  
  // const {isLoading, data} = useQuery('queryKey', apis.get);
  const [checkedInputs, setCheckedInputs] = useState([]);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter((el) => el !== id));
    }
  };

  return (
    <div className="home">
      <Checkbox _id={"id"} _text={"개인정보 수집 및 이용 동의(필수)"} _size={"1.2rem"} _bgColor={"#1184ff"} _required={"required"} onChange={changeHandler}
        checked={checkedInputs}/>
      <Checkbox _id={"id2"} _text={"개인정보 수집 및 이용 동의(필수)2"} _size={"1.2rem"} _required={"required"} onChange={changeHandler}
        checked={checkedInputs}/>
      <Input _width={"100%"} _placeholder={"아이디(이메일)"} _required={"required"} />
      <Button _color={"#fff"}>버튼2</Button>
    </div>
  );
}

export default Home;