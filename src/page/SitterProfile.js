import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Calendar } from "react-multi-date-picker";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { apis } from "../store/api";
import { comma } from "../shared/common";

const SitterProfile = () => {
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
  },[sitterSuccessGet, sitterSuccessDelete, sitterData.data.sitterprofile])

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
              <Calendar value={values.noDate} readOnly={true}></Calendar>
            </div>
          </div>
        ) : (
          <div className="inner">
            <Link to={`/mypage/SitterProfileForm1`}>
              <button>돌보미로 등록하세요</button>
            </Link>
          </div>
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
export default SitterProfile;
