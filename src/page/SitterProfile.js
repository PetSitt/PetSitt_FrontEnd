import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Calendar, DateObject } from "react-multi-date-picker";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apis } from "../store/api";
import { comma } from "../shared/common";

const SitterProfile = () => {
  const navigate = useNavigate();
  const today = new DateObject();
  const queryClient = useQueryClient();
  const [caresizeData, setCaresizeData] = useState(["소형견", "중형견", "대형견"])
  const {data: sitterData, isSuccess: sitterSuccessGet } = useQuery("sitterprofile", apis.sitterprofileGet);
  const [values, setValues] = useState(sitterData.data.sitterprofile);
  const { mutate: delect, isSuccess: sitterSuccessDelete} = useMutation(apis.sitterprofileDelete, {
    onSuccess: () => {
      queryClient.invalidateQueries("sitterprofile");
    },
    onError: (data) => {
      console.log(data, 'error');
    }
  });

  useEffect(() => {
    (sitterSuccessGet || sitterSuccessDelete) && setValues(sitterData.data.sitterprofile);
  },[sitterSuccessGet, sitterSuccessDelete, sitterData])


  return (
    <SitterProfileInner>
      <h1>돌보미 프로필</h1>
      
      {values && <Link to={`/mypage/SitterProfileForm1`} state={{data: values}}>수정</Link>}
      {values && <button onClick={delect}>삭제</button>}
      {
        values ? (
          <div className="profileinner">
            <div className="profileMainImg inner">
              <img src={values.mainImageUrl} />
            </div>
            <div className="profileFee inner">
              <h3 className="tit">요금</h3>
              <p>{comma(values.servicePrice)}</p>
            </div>
            <div className="inner">
              <h3 className="tit">제공가능한 서비스</h3>
              {values.category.map((el, idx) => {
                return(el && <div key={idx}>{el}</div>)
              })}
            </div>
            <div className="inner">
              <h3 className="tit">케어 가능한 범위</h3>
              {values.careSize.map((el, idx) => {
                return(el && <div key={idx}>{caresizeData[idx]}</div>)
              })}
            </div>
            <div className="inner">
              <h3 className="tit">제공 가능한 서비스</h3>
              {values.category.map((el, idx) => {
                return(<div key={idx}>{el}</div>)
              })}
            </div>
            <div className="inner">
              <h3 className="tit">추가 가능한 서비스</h3>
              {values.plusService.map((el, idx) => {
                return(<div key={idx}>{el}</div>)
              })}
            </div>
            <div className="inner">
              <h3 className="tit">서비스 가능한 날짜</h3>
              {console.log(values.noDate)}
              <Calendar value={values.noDate} readOnly={true} minDate={new Date()} maxDate={new Date(today.year + 1, today.month.number, today.day)}></Calendar>
            </div>
          </div>
        ) : (
          <SitterProfileInsertBox>
          <h3>돌보미로 등록하세요</h3>
          <p>돌보미 프로필을 등록해보세요</p>
          <SitterProfileInsertButton
            onClick={() => {
              navigate('/mypage/SitterProfileForm1');
            }}
          >
            돌보미로 등록하기
          </SitterProfileInsertButton>
        </SitterProfileInsertBox>
        )
      }
    </SitterProfileInner>
  );
};

const SitterProfileInner = styled.div`
  .profileMainImg {
    width: 160px;
  }
  .profileinner {
    .inner {
      .tit {
        font-size:20px; 
        font-weight:600;
      }
    }
    img {
      width: 100%;
    }
  }
  .profileFee {

  }
  input,
  textarea {
    width: 100%;
    border: 1px solid #000;
  }
`;

const SitterProfileInsertBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 180px;
  h3 {
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    padding-bottom: 16px;
  }

  p {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #676767;
    padding-bottom: 24px;
  }
`;

const SitterProfileInsertButton = styled.button`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  padding: 12px 20px;
  background: #ffffff;
  border: 1px solid #fc9215;
  border-radius: 54px;
  color: #fc9215;
`;

export default SitterProfile;
