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
  const [values, setValues] = useState(update ? data : { ...data, ...INITIAL_VALUES });
  const [dates, setDates] = useState([]);
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
    if(update){
      const noNewDate = dates.map((el) => typeof el === 'object' && el.format()); //켈린더의 날짜 데이터가 object type일때 배열에 문자열로 추출
      setValues((prevValues) => {
        const noDates = [...prevValues.noDate, ...noNewDate]; //기존 배열에 noDate있던 데이터랑 새로운 noDate있던랑 병합
        const noDate = noDates.filter((v, i) => noDates.indexOf(v) === i); //중복된 데이터 제거
        return {...prevValues, noDate}
      });
    }
  },[dates, update])

  const handleSubmit = (e) => {
    e.preventDefault();
    setDates(values.noDate);
    // const test = typeof values.imageUrl === 'object';
    // console.log(test ? typeof values.imageUrl : null)
    console.log(dates)
    console.log(values.noDate)

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
      <Calendar required multiple sort format={format} value={values.noDate} minDate={new Date()} maxDate={new Date(today.year + 1, today.month.number, today.day)} onChange={setDates}></Calendar>
      
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