import { memo, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Calendar, DateObject } from "react-multi-date-picker";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apis } from "../store/api";
import { comma } from "../shared/common";
import NavBox from "../elements/NavBox";
import Checkbox from "../elements/Checkbox";
import sitterDefault from '../assets/img/img_sitter_default.png'

const SitterProfile = () => {
  const navigate = useNavigate();
  const today = new DateObject();
  const queryClient = useQueryClient();
  const { data: sitterData, isSuccess: sitterSuccessGet } = useQuery(
    "sitterprofile",
    apis.sitterprofileGet,{
      staleTime: Infinity,
    }
  );

  const [values, setValues] = useState(sitterData.data.sitterprofile);
  const { mutate: delect, isSuccess: sitterSuccessDelete } = useMutation(
    apis.sitterprofileDelete,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("sitterprofile");
      },
      onError: (data) => {
      },
    }
  );
  useEffect(() => {
    (sitterSuccessGet || sitterSuccessDelete) &&
      setValues(sitterData.data.sitterprofile);
  }, [sitterData.data.sitterprofile, sitterSuccessDelete, sitterSuccessGet]);

  return (
    <>
      <SitterProfileInner>
        <NavBox _title="돌보미 프로필"/>
        {values ? (
          <div className="profileinner">
            <div>
              <div className="profileMainImg inner">
                <span style={{backgroundImage: `url(${values.imageUrl ? values.imageUrl : sitterDefault})`}}></span>
              </div>
            </div>
            <label className="inner required">
              <p className="tit">이름</p>
              <BoxInner className="sitterName">{values.sitterName}</BoxInner>
            </label>
            <label className="inner required">
              <p className="tit">요금</p>
              <BoxInner className="servicePrice">{comma(values.servicePrice)}</BoxInner>
            </label>
            <CheckWrap>
              <label className="tit">제공 가능한 서비스</label>
              <CheckGroup>
                {values.category.map((el, idx) => {
                  return(
                    <Checkbox
                      key={idx}
                      _id={el}
                      _key={"category"}
                      _text={el}
                      _size={"1.2rem"}
                      checked={values.category}
                      disabled
                    />
                  )
                })}
              </CheckGroup>
            </CheckWrap>
            <CheckWrap>
              <label className="tit">케어 가능 범위</label>
              <CheckGroup>
                {values.careSize.map((el, idx) => {
                  if(el){
                    return(
                      <Checkbox
                        key={idx}
                        _text={idx === 0 ? "소형견" : idx === 1 ? "중형견" : "대형견"}
                        _size={"1.2rem"}
                        _id={idx === 0 ? "소형견" : idx === 1 ? "중형견" : "대형견"}
                        checked={idx === 0 && el ? "소형견" : idx === 1 && el ? "중형견" : idx === 2 && el ? "대형견" : ""}
                        disabled
                      />
                      )
                  }
                })}
                
                {/* <Checkbox
                  _text={"중형견"}
                  _size={"1.2rem"}
                  onChange={(e) => {
                    setValues((prevValues) => {
                      const careSize = [...prevValues.careSize];
                      careSize[1] = e.target.checked;
                      return { ...prevValues, careSize };
                    });
                  }}
                  checked={values.careSize}
                  disabled
                />
                <Checkbox
                  _text={"대형견"}
                  _size={"1.2rem"}
                  onChange={(e) => {
                    setValues((prevValues) => {
                      const careSize = [...prevValues.careSize];
                      careSize[2] = e.target.checked;
                      return { ...prevValues, careSize };
                    });
                  }}
                  checked={values.careSize}
                  disabled
                /> */}
              </CheckGroup>
            </CheckWrap>
            <div className="inner">
              <h3 className="tit">서비스 불가능한 날짜</h3>
              <Calendar
                value={values.noDate}
                readOnly={true}
                minDate={new Date()}
                maxDate={
                  new Date(today.year + 1, today.month.number, today.day)
                }
              ></Calendar>
            </div>
          </div>
        ) : (
          <SitterProfileInsertBox>
            <h3>돌보미로 등록하세요</h3>
            <p>돌보미 프로필을 등록해보세요</p>
            <SitterProfileInsertButton
              onClick={() => {
                navigate("/mypage/SitterProfileForm1");
              }}
            >
              돌보미로 등록하기
            </SitterProfileInsertButton>
          </SitterProfileInsertBox>
        )}

        <SitterBut className="">
          {values && <button onClick={() => {
                navigate("/mypage/SitterProfileForm1", { state: values });
            }}>수정</button>}
          {values && <button onClick={delect}>삭제</button>}
        </SitterBut>
      </SitterProfileInner>
    </>
  );
};

const SitterProfileInner = styled.div`
  input[type="text"] {
    width: 100%;
    min-height: 48px;
    background: #ffffff;
    border: 1px solid rgba(120, 120, 120, 0.4);
    border-radius: 6px;
    padding: 12px;
    :disabled {
      background: #eee;
    }
  }
  .tit {
    font-size: 16px;
    line-height: 19px;
    padding-bottom: 7px;
    margin-top: 24px;
  }

  .profileMainImg {
    text-align: center;
    span {
      display: block;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      margin: 0 auto;
      border: 1px solid #e9e9e9;
      box-sizing: border-box;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
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

const SitterBut = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  button {
    flex-grow: 1;
    height: 47px;
    background-color: #FC9215;
    margin: 3px;
    padding: 2px;
    border-radius: 3px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
  }
`
const BoxInner = styled.div`
  width: 100%;
  min-height: 48px;
  line-height: 48px;
  border: 1px solid rgba(120,120,120,0.4);
  border-radius: 6px;
  padding: 0 12px;
  background: #eee;
`
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

const CheckWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  & label {
    font-size: 16px;
    line-height: 19px;
    padding-bottom: 7px;
  }
`;

const CheckGroup = styled.div`
  label {
    margin-right: 10px;
  }
`;

export default memo(SitterProfile);
