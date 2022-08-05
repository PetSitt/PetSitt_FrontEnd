import styled from "styled-components";
import { Calendar, DateObject } from "react-multi-date-picker";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { apis } from "../store/api";
import NavBox from "../elements/NavBox";
import StyledContainer from "../elements/StyledContainer";
import StyledButton from "../elements/StyledButton";

const format = "YYYY/MM/DD";

function SitterProfileForm4() {
  const today = new DateObject();
  const {data, update} = useLocation().state;
  const [dates, setDates] = useState(data.noDate);
  const [newDates, setNewDates] = useState([]);
  const [dateMsg, setDateMsg] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // useMutation 생성하는 세팅 함수
  const { mutate: create } = useMutation(apis.sitterprofilePost, {
    onSuccess: () => {
      //초기화 시킴
      queryClient.invalidateQueries("sitterprofile");
      navigate("/mypage/sitterprofile");
    },
    onError: (data) => {
      if(data.response.status === 400){
        setDateMsg('달려을 필수로 선택 해주셔야 합니다.!!')
      }
    },
  });

  // useMutation 수정하는 세팅 함수
  const { mutate: sitterUpdate } = useMutation(apis.sitterprofilePatch, {
    onSuccess: () => {
      //초기화 시킴
      queryClient.invalidateQueries("sitterprofile");
      navigate("/mypage/sitterprofile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("sitterName", data.sitterName);
    formData.append("address", data.address);
    formData.append("detailAddress", data.detailAddress);
    formData.append("region_1depth_name", data.region_1depth_name);
    formData.append("region_2depth_name", data.region_2depth_name);
    formData.append("region_3depth_name", data.region_3depth_name);
    formData.append("zoneCode", data.zoneCode);
    formData.append("x", data.x);
    formData.append("y", data.y);
    formData.append("imageUrl", data.imageUrl);
    formData.append("mainImageUrl", data.mainImageUrl);
    formData.append("introTitle", data.introTitle);
    formData.append("myIntro", data.myIntro);
    formData.append("careSize", JSON.stringify(data.careSize));
    formData.append("category", JSON.stringify(data.category));
    formData.append("plusService", JSON.stringify(data.plusService));
    formData.append("noDate", JSON.stringify(dates));
    formData.append("servicePrice", data.servicePrice);

    update ? sitterUpdate(formData) : create(formData)
  }
  useEffect(()=>{
    if(dates && typeof dates[0] === 'object'){
      setNewDates(()=>{
        return dates.map(v=>{
          const newDateForm = `${v.year}/${v.month?.number < 10 ? '0' + v.month?.number : v.month?.number}/${v.day < 10 ? '0' + v.day : v.day}`
          return newDateForm;
        });
      })
    }
  },[dates])

  return (
    <StyledContainer>
    <Form onSubmit={handleSubmit}>
      <NavBox _title='서비스 불가능한 날짜' _subTitle='4/4' sitterEditProfile />
      <Calendar required multiple sort format={format} value={ dates } onChange={ setDates } minDate={new Date()} maxDate={new Date(today.year + 1, today.month.number, today.day)}></Calendar>
      { dates === undefined ? <p style={{color:'red'}}>{dateMsg}</p> : null }
      <StyledButton
          _onClick={handleSubmit}
          _title={ update ? "수정하기" : "등록하기"}
        />
    </Form>
    </StyledContainer>
  );
}

const Form = styled.form`
  input,
  textarea {
    border: 1px solid #000;
  }
`;

export default SitterProfileForm4;