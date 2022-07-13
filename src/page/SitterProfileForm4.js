import Button from "../elements/Button";
import styled from "styled-components";
import { Calendar } from "react-multi-date-picker"
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { apis } from "../store/api";


const format = "YYYY/MM/DD";
const INITIAL_VALUES = {
  noDate: []
};

function SitterProfileForm4() {
  const { data } = useLocation().state;
  const [values, setValues] = useState({...data, ...INITIAL_VALUES});
  const [dates, setDates] = useState([]);
  const queryClient = useQueryClient();


  // useMutation 생성하는 세팅 함수
  const { mutate: create } = useMutation(apis.sitterProfilePost, {
    onSuccess: () => {
      Navigate("/mypage/sitterprofile");
    },
    onError: (data) => {
      console.log(data);
    },
  });

   // useMutation 수정하는 세팅 함수
   const { mutate: update } = useMutation(apis.petprofilePatch, {
    onSuccess: (data) => {
      queryClient.setQueryData(["petprofile", values.petId], data);
      queryClient.invalidateQueries("petprofile");
      Navigate("/mypage/sitterprofile");
    },
    onError: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    const noDate = dates.map((el) => el.format());
    setValues((prevValues) => {
      return {...prevValues, noDate}
    });
  },[dates])

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userName", values.userName);
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
    formData.append("careSize", values.careSize);
    formData.append("category", values.category);
    formData.append("plusService", values.plusService);
    formData.append("noDate", values.noDate);
    formData.append("servicePrice", values.servicePrice);

    const fields = {
      data: formData
    };

    create(formData)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1>돌보미 등록<span>4/4</span></h1>
      <Calendar multiple sort format={format} value={values.noDate} onChange={setDates}></Calendar>
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