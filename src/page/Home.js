import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {apis} from '../store/api'
import Input from '../elements/Input';
import Button from "../elements/Button";
import Checkbox from "../elements/Checkbox";

const INITIAL_VALUES = {
	"소형견": false,
	"중형견": false,
	"대형견": false
};

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
  const [isChecked, setIsChecked] = useState(false);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter((el) => el !== id));
    }
  };

  const checkedHandler = (isChecked) => {
    if(isChecked){
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }

  const [size, setSize] = useState([false, false, false]);
  console.log(size);

  return (
    <div className="home">
      {console.log(checkedInputs)}
      <Checkbox _id={"소형견"} _text={"소형견"} _size={"1.2rem"} onChange={changeHandler} checked={checkedInputs} />
      <Checkbox _id={"중형견"} _text={"중형견"} _size={"1.2rem"} onChange={changeHandler} checked={checkedInputs} />
      <Checkbox _id={"대형견"} _text={"대형견"} _size={"1.2rem"} onChange={changeHandler} checked={checkedInputs} />
      
      <Checkbox _text={"산책"} _size={"1.2rem"} onChange={checkedHandler} checked={isChecked}/>

      <Input _width={"100%"} _placeholder={"아이디(이메일)"} _required={"required"} />
      <Button _color={"#fff"}>버튼2</Button>

      {/* true, false 배열에 담는거 테스트 */}
      <input type="checkbox" onChange={(e)=>{
        setSize((prev)=>{
          const newData = [...prev];
          newData[0] = e.target.checked;
          return newData;
        })
      }}/>
      <input type="checkbox" onChange={(e)=>{
        setSize((prev)=>{
          const newData = [...prev];
          newData[1] = e.target.checked;
          return newData;
        })
      }}/>
      <input type="checkbox" onChange={(e)=>{
        setSize((prev)=>{
          const newData = [...prev];
          newData[2] = e.target.checked;
          return newData;
        })
      }}/>
    </div>
  );
}

export default Home;