import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import { DateObject, Calendar } from "react-multi-date-picker";
import MapContainer from "./MapContainer";
import { apis } from "../store/api";
import Settings from "react-multi-date-picker/plugins/settings"

import StyledButton from '../elements/StyledButton';

const Detail = () => {
	// 62c63d6f25208ae3d3cda472
	const queryClient = useQueryClient();
	const param = useParams();
  const navigate = useNavigate();
	const sitterId = param.id;
	const [detail, setDetail] = useState();
	const today = new DateObject();
	const [date, setDate] = useState();
	const [dates, setDates] = useState(new Date());
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
  const [unavailable, setUnavailable] = useState([]);
  const [services, setServices] = useState();
  const [servicesText, setServicesText] = useState([]);
  const [selectBoxToggle, setSelectBoxToggle] = useState({
    type: "",
    status: false,
  });
  const [calendar, setCalendar] = useState('body');
  const [errorMessage, setErrorMessage] = useState();
  const disableDate = () => {
    const datesArray = [];
    detail?.sitter.noDate.map(v=>{
      if (new Date(v).getMonth()+1 === month){
        datesArray.push(new Date(v).getDate())
      }
    })
    setUnavailable(datesArray);
  }
	const [reviews, setReviews] = useState([
		{
			userName: "김대한",
			reviewStar: 4.0,
			reviewDate: "2022/06/29",
			reviewInfo: "1000글자 제한 리뷰",
		},
		{
			userName: "김민국",
			reviewStar: 5.0,
			reviewDate: "2022/06/28",
			reviewInfo: "1000글자 제한 리뷰적어요!",
		},
	]);
	const {
		isLoading: detailIsLoading,
		isSuccess,
		isFetched,
		data: detailData,
	} = useQuery("detail_data", () => apis.getUserDetail(sitterId), {
		onSuccess: (data) => {
			console.log(data.data, "data loaded");
		},
		onError: (data) => {
			console.error(data);
		},
		staleTime: Infinity,
		refetchOnMount: "always",
	});
	const checkSelectArea = (e) => {
		if (!e.target.closest(".select_area") && !e.target.closest('.select_wrap')) {
			setSelectBoxToggle({ type: "", status: false });
		}
	};
  const requestReservation = async () => {
    let trueLength = 0;
    for (let i = 0; i < services.length; i++) {
      if (services[i]) {
        trueLength++;
      }
    }
    if (trueLength === 0) {
      setErrorMessage("서비스를 선택해주세요.");
      return;
    }
    if (dates.length === 0) {
      setErrorMessage("날짜를 선택해주세요.");
      return;
    }
    const reservationInfo = {
      date: dates,
      service: servicesText,
      userName: detail.user.userName,
      price: detail.sitter.servicePrice,
      sitterId: detail.sitter.sitterId,
    }
    await localStorage.setItem('reservationInfo', JSON.stringify(reservationInfo));
    navigate('/reservation');
  }
  useEffect(()=>{
    let elements = null; 
    if(selectBoxToggle.status && selectBoxToggle.type === 'date'){
      elements = document.querySelectorAll('.calendar_onModal .rmdp-day .sd');
    }else{
      elements = document.querySelectorAll('.calendar_onBody .rmdp-day .sd');
    }
    
    for(let i=0; i<elements.length; i++){
      for(let j=0; j<unavailable.length; j++){
        if(elements[i].innerText/1 === unavailable[j]){
          elements[i].parentNode.classList.add('rmdp-disabled');
        }
      }
    }
  },[unavailable])
  console.log(unavailable, detail?.sitter.noDate)
	useEffect(() => {
		setDetail(detailData.data);
    setServices(Array.from({length: detailData.data.sitter.category.length}, () => false));
    console.log(detailData.data.sitter.noDate)
	}, [detailData.data]);
  useEffect(()=>{
    if(detail){
      disableDate();
    }
  },[detail, month, selectBoxToggle]);
	useEffect(() => {
		window.addEventListener("click", checkSelectArea);
		return()=>{
			setDetail('');
		}
	}, []);
  useEffect(()=>{
    if(services?.length > 0){
      setServicesText(()=>{
        const new_data = [];
        for (let i = 0; i < services.length; i++) {
          if (services[i]) {
            new_data.push(detail.sitter.category[i]);
          }
        }
        return new_data;
      });
    }
  }, [services]);

  // const {data: reviewsData} = useQuery('reviews_data', () => apis.getReviews(sitterId, {reviewId: 0}), {
  //   onSuccess: (data) => {
  //     console.log(data);
  //   },
  //   onError: (data) => {
  //     console.error(data);
  //   },
  //   staleTime: Infinity,
  // })


  useEffect(() => {
    if (date?.length >= 0) {
      const getDates = date.map((v) => {
        return v.format(v._format);
      });
      setDates(getDates);
    }
  }, [date]);


  if (detailIsLoading || !detail) return <p>로딩중입니다</p>;
	return (
		<SitterDetailPage>
			<section className="page_top">
        <section>
          <TopImage style={{backgroundImage: `url(${detail.sitter.mainImageUrl})`, margin: '0 -20px'}}></TopImage>
          <SitterProfile>
            <li className="profile">
              <span
                style={{ backgroundImage: `url(${detail.sitter.imageUrl})` }}
              ></span>
            </li>
            <li className="user">
              <p className="userName">{detail.user.userName}</p>
              <p className="score">
                <i className="ic-star"></i>
                <strong>{detail.sitter.averageStar}</strong>{`(54)`}
              </p>
            </li>
            <li className="address"><i className="ic-location"></i>{detail.sitter.address}</li>
            <li>
              <p className="rehire">재고용률 <strong>{detail.sitter.rehireRate}%</strong></p>	
            </li>
            <li className="introduce">
              <dl>
                <dt>{detail.sitter.introTitle}</dt>
                <dd>{detail.sitter.myIntro}</dd>
              </dl>
            </li>
          </SitterProfile>
        </section>
			</section>
      <section className="page_body">
        <section>
          <h3 style={{ display: "flex", justifyContent: "space-between" }}>
            서비스 예약하기
            <p>
              <strong>{detail.sitter.servicePrice}원</strong>/일
            </p>
          </h3>
          <ServiceList>
            {detail.sitter.category.map((v, i) => {
              return (
                <li key={`category_${i}`}>
                  <div>
                    <label>
                      <input type="checkbox" checked={services[i]} onChange={(e)=>{
                        setServices((prev)=>{
                          const new_data = [...prev];
                          new_data[i] = e.target.checked;
                          return new_data;
                        })
                      }}/>
                      <span>
                        <i></i>
                        {v}
                      </span>
                    </label>
                  </div>
                </li>
              );
            })}
          </ServiceList>
          <div>
            <Calendar
              className="calendar_onBody"
              value={date && date}
              onChange={setDate}
              multiple={true}
              format="YYYY/MM/DD"
              minDate={new Date()}
              maxDate={new Date(today.year + 1, today.month.number, today.day)}
              shadow={false}
              weekDays={weekDays}
              months={months}
              onMonthChange={(date) => setMonth(new Date(date).getMonth()+1)}
            />
          </div>
        </section>
        <section>
          <h3>서비스 가능한 반려견 사이즈</h3>
          <ul>
            {detail.sitter.careSize.map((v, i) => {
              return (
                <li key={`careSize_${i}`}>
                  {v && (i === 0 ? "소" : i === 1 ? "중" : "대")}
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h3>추가 제공 가능한 서비스</h3>
          <ul>
            {detail.sitter.plusService.map((v, i) => {
              return <li key={`plusService_${i}`}>{v}</li>;
            })}
          </ul>
        </section>
        <section className="pets_info_section">
          <h3>{detail.user.userName}님과 함께사는 반려견</h3>
          <ul>
            {detail.pets.map((v, i) => {
              return (
                <li key={`pet_${i}`}>
                  <span
                    className="pet_image"
                    style={{ backgroundImage: `url(${v.petImage})` }}
                  ></span>
                  <p className="pet_name">{v.petName}</p>
                  <p className="pet_type">{v.petAge}살 {v.petType}</p>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="pets_info_section">
          <h3>{detail.user.userName}님에 대한 후기</h3>
          <ul>
            {reviews.map((v, i) => {
              return (
                <li key={`review_${i}`}>
                  <div>
                    <span>{v.userName}</span>
                    <span>{v.reviewStar}</span>
                    <span>{v.reviewDate}</span>
                  </div>
                  <p>{v.reviewInfo}</p>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h3>{detail.user.userName}님의 위치</h3>
          <MapWrapper>
            <MapContainer
              centerElement={{x: detail.sitter.x, y: detail.sitter.y, userName: detail.user.userName, reviewStar: detail.sitter.averageStar}}
              showOnly={true}
              _height="100%"
            />
          </MapWrapper>
          <p>{detail.sitter.address}</p>
        </section>
      </section>
      <ReservationFunctions>
        {selectBoxToggle.status &&
          (selectBoxToggle.type === "service" ? (
            <div className="select_wrap service">
              <h3 style={{ display: "flex", justifyContent: "space-between" }}>
                서비스 선택하기
                <p style={{ fontSize: "16px" }}>
                  <strong>{detail.sitter.servicePrice}원</strong>/일
                </p>
              </h3>
              <div>
                <ul style={{ margin: "10px 0" }}>
                  {detail.sitter.category.map((v, i) => {
                    return (
                      <li key={`category_${i}`}>
                        <label>
                          <input
                            type="checkbox"
                            checked={services[i]}
                            onChange={(e) => {
                              setServices((prev) => {
                                const new_data = [...prev];
                                new_data[i] = e.target.checked;
                                return new_data;
                              });
                            }}
                          />
                          {v}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : (
            <div className="select_wrap date">
              <h3>날짜 선택하기</h3>
              <div>
                <p>
                  {dates.length > 0 &&
                    dates?.map((v, i) => {
                      return (
                        <>
                          {i > 0 ? ", " : ""}
                          <span
                            key={`date_${v}`}
                            style={{ display: "inline-block" }}
                          >
                            {v}
                          </span>
                        </>
                      );
                    })}
                </p>
                <Calendar
                  className="calendar_onModal"
                  value={date && date}
                  onChange={setDate}
                  multiple={true}
                  format="YYYY/MM/DD"
                  minDate={new Date()}
                  maxDate={new Date(today.year + 1, today.month.number, today.day)}
                  shadow={false}
                  weekDays={weekDays}
                  months={months}
                  onMonthChange={(date) => setMonth(new Date(date).getMonth()+1)}
                />
              </div>
            </div>
          ))}

        <ul className="select_area">
          <li
            onClick={() => {
              setSelectBoxToggle({ type: "service", status: true });
            }}
          >
            <span>서비스</span>
            <strong>
              {servicesText.length > 0
                ? servicesText.join(", ")
                : "서비스를 선택해주세요."}
            </strong>
          </li>
          <li
            onClick={() => {
              setMonth(new Date().getMonth()+1);
              setSelectBoxToggle({ type: "date", status: true });
            }}
          >
            <span>날짜</span>
            <strong>
              {dates.length > 0 && dates.length < 4
                ? dates.sort().join(", ")
                : dates.length >= 4
                ? `4일 이상 선택(총 ${dates.length}일)`
                : "날짜를 선택해주세요."}
            </strong>
          </li>
          <li className="price">
            <span>결제예정금액</span>
            <strong><em>{detail.sitter.servicePrice}</em>원/일</strong>
          </li>
        </ul>
        <div className="buttons">
          <StyledButton
            _onClick={() => console.log('')}
            _bgColor={'rgba(252, 146, 21, 0.1)'}
            color={'#fc9215'}
            _title="문의하기"
            _margin="0"
          />
          <StyledButton
            _onClick={requestReservation}
            _title="예약하기"
            _margin="0"
          />
        </div>
      </ReservationFunctions>
    </SitterDetailPage>
  );
};

const ReservationFunctions = styled.div`
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  background-color: #fff;
  border-top: 1px solid #C9C9C9;
  margin: 0 -20px;
  .select_wrap {
    h3 {
      font-size: 18px;
      font-weight: bold;
      padding: 10px 20px;
      border-bottom: 1px solid #ddd;
    }
    & > div {
      padding: 0 20px;
    }
  }
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    height: 40px;
    padding: 0 20px;
    cursor: pointer;
    border-bottom: 1px solid #C9C9C9;
    label {
      display: block;
      width: 100%;
    }
    span {
      color: #676767;
    }
    strong {
      font-size: 14px;
      font-weight: 500;
    }
    &.price{
      cursor: default;
      strong{
        font-weight: normal;
        color: #1A1A1A;
        em{
          color: #FC9215;
          font-weight: 500;
        }
      }
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px 30px;
    button {
      flex-basis: 50%;
    }
  }
`;
const SitterDetailPage = styled.div`
  position: relative;
  line-height: 1.4;
  & > section {
    &.page_top{
      section{
        padding-bottom: 48px;
      }
      &:after{
        content: '';
        display: block;
        height: 8px;
        background-color: rgba(245, 245, 245, 1);
        margin: 0 -20px;
      }
    }
    &.page_body{
      padding: 70px 0;
      .rmdp-border{
        margin-top: 46px;
      }
    }
    & > section{
      h3 {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 22px;
        line-height: 1.2;
        p{
          font-size: 14px;
          font-weight: normal;
          letter-spacing: .03em;
          strong{
            font-size: 18px;
            letter-spacing: normal;
          }
        }
      }
      & + section {
        padding: 70px 0 0;
      }
      &.pets_info_section {
        ul {
          display: flex;
          flex-direction: row;
          gap: 16px;
          li {
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            align-items: center;
            justify-items: center;
            .pet_image {
              display: block;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }
            .pet_name{
              line-height: 1;
              margin: 10px 0 5px;
              font-weight: 500;
            }
            .pet_type{
              color: #676767;
              line-height: 1;
            }
          }
        }
      }
    }
  }
`;
const TopImage = styled.div`
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 0;
  padding-bottom: 50.4%;
`
const SitterProfile = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -40px;
  li {
    &.profile span {
      display: inline-block;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border: 3px solid #fff;
      box-sizing: border-box;
    }
    &.user{
      display: flex;
      align-items: center;
      .userName{
        font-size: 21px;
        font-weight: 500;
      }
      .score{
        font-size: 14px;
        strong{
          font-weight: 500;
        }
        i{
          display: inline-block;
          width: 18px;
          height: 18px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          vertical-align: middle;
          margin: -4px 1px 0 8px;
        }
      }
    }
    &.address{
      color: #676767;
      margin: 10px 0;
      line-height: 1;
      i{
        display: inline-block;
        font-size: 20px;
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 4px;
      }
    }
    .rehire{
      display: inline-block;
      font-size: 12px;
      font-weight: 500;
      background: rgba(252, 146, 21, 0.1);
      border-radius: 3px;
      color: #FC9215;
      padding: 0 6px;
      line-height: 20px;
    }
    &.introduce{
      margin-top: 36px;
      dt{
        line-height: 1.2;
      }
      dd{
        color: #676767;
        line-height: 1.4;
        margin-top: 8px;
      }
    }
  }
`;
const ServiceList = styled.ul`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 -5px;
  li{
    flex-basis: 50%;
    box-sizing: border-box;
    padding: 0 5px;
    label{
      position: relative;
      input{
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        &:checked + span{
          border-color: #FC9215;
          color: #FC9215;
        }
      }
      span{
        display: block;
        border: 2px solid rgba(120,120,120,.2);
        border-radius: 6px;
        padding: 20px 0;
        text-align: center;
        color: rgba(120,120,120,.7);
      }
    }
    &:nth-of-type(n+3){
      margin-top: 16px;
    }
  }
`
const MapWrapper = styled.div`
  width: 100%;
  height: 12vw;
  border-radius: 10px;
  overflow: hidden;
  & + p{
    font-size: 14px;
    line-height: 1.2;
    margin-top: 8px;
  }
`

export default Detail;
