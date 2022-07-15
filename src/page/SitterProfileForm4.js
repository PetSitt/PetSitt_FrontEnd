import Button from "../elements/Button";
import styled from "styled-components";
import { Calendar, DateObject } from "react-multi-date-picker";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { apis } from "../store/api";

const format = "YYYY/MM/DD";
const INITIAL_VALUES = {
  noDate: []
};

function SitterProfileForm4() {
  const today = new DateObject();
  const {data, update} = useLocation().state;
  const [values, setValues] = useState(update ? data.noDate : { ...data, ...INITIAL_VALUES });
  const [dates, setDates] = useState(update ?  data.noDate : (values.noDate));
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // useMutation 생성하는 세팅 함수
  const { mutate: create } = useMutation(apis.sitterprofilePost, {
    onSuccess: () => {
      //무효화 시킴
      queryClient.invalidateQueries("sitterprofile");
      navigate("/mypage/sitterprofile");
    },
    onError: (data) => {
      console.log(data);
    },
  });

  // useMutation 수정하는 세팅 함수
  const { mutate: sitterUpdate } = useMutation(apis.sitterprofilePatch, {
    onSuccess: (data) => {
      queryClient.setQueryData(["sitterprofile", values.petId], data);
      queryClient.invalidateQueries("sitterprofile");
      navigate("/mypage/sitterprofile");
    },
    onError: (data) => {
      console.log(data);
    },
  });
  
  useEffect(() => {
    if(!update){ //등록모드 일때 실행.
      const noDate = dates.map((el) => typeof el !== 'string' && el.format()); //켈린더의 날짜 데이터가 object type일때 배열에 문자열로 추출
      setValues(() => {
        return {...values, noDate}
      });
    } else { //수정모드 일때 실행.
      setValues((preve) => {
        return [...preve, ...values]
      });
    }
  },[dates])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(dates)
    // const test = typeof values.imageUrl === 'object';
    // console.log(test ? typeof values.imageUrl : null)

    const formData = new FormData();
    formData.append("sitterName", values.sitterName);
    formData.append("gender", values.gender);
    formData.append("address", values.address);
    formData.append("detailAddress", values.detailAddress);
    formData.append("region_1depth_name", values.region_1depth_name);
    formData.append("region_2depth_name", values.region_2depth_name);
    formData.append("region_3depth_name", values.region_3depth_name);
    formData.append("zoneCode", values.zoneCode);
    formData.append("x", values.x);
    formData.append("y", values.y);
    formData.append("imageUrl", values.imageUrl);
    formData.append("mainImageUrl", values.mainImageUrl);
    formData.append("introTitle", values.introTitle);
    formData.append("myIntro", values.myIntro);
    formData.append("careSize", JSON.stringify(values.careSize));
    formData.append("category", JSON.stringify(values.category));
    formData.append("plusService", JSON.stringify(values.plusService));
    formData.append("noDate", JSON.stringify(values.noDate));
    formData.append("servicePrice", values.servicePrice);
    update ? sitterUpdate(formData) : create(formData)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1>돌보미 등록<span>4/4</span></h1>
      <Calendar required multiple sort format={format} value={ update ? values : dates } onChange={setDates} minDate={new Date()} maxDate={new Date(today.year + 1, today.month.number, today.day)}></Calendar>
      
      <Button _color={"#fff"}>{ update ? "수정하기" : "등록하기"}</Button>
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