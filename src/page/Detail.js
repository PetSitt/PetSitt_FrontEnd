import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import DatePicker, { DateObject, Calendar } from "react-multi-date-picker";
import MapContainer from "./MapContainer";
import { apis } from "../store/api";
import axios from 'axios';

const Detail = () => {
	// 62c63d6f25208ae3d3cda472
	const queryClient = useQueryClient();
	const param = useParams();
	const sitterId = param.id;
	const [detail, setDetail] = useState();
	const today = new DateObject();
	const [date, setDate] = useState();
	const [dates, setDates] = useState(new Date());
  const [services, setServices] = useState();
  const [servicesText, setServicesText] = useState([]);
  const [selectBoxToggle, setSelectBoxToggle] = useState({
    type: "",
    status: false,
  });
  const [errorMessage, setErrorMessage] = useState();
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
			console.log('success')
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
  const requestReservation = () => {
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
  }
	useEffect(() => {
		setDetail(detailData.data);
    setServices(Array.from({length: detailData.data.sitter.category.length}, () => false))
	}, [detailData.data]);
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
			<section>
				<img src={detail.sitter.mainImageUrl} style={{ maxWidth: "100%" }} />
				<SitterProfile>
					<li className="profile">
						<span
							style={{ backgroundImage: `url(${detail.sitter.imageUrl})` }}
						></span>
					</li>
					<li className="userName">{detail.user.userName}</li>
					<li className="score">평균 평점 {detail.sitter.averageStar}</li>
					<li>
						<strong>{detail.sitter.servicePrice}원</strong>
						<span>/일</span>
					</li>
					<li>
						재고용률: <strong>{detail.sitter.rehireRate}%</strong>
					</li>
					<li>{detail.sitter.introTitle}</li>
					<li>{detail.sitter.myIntro}</li>
				</SitterProfile>
			</section>
			<section>
				<h3 style={{ display: "flex", justifyContent: "space-between" }}>
					서비스 예약하기
					<p style={{ fontSize: "16px" }}>
						<strong>{detail.sitter.servicePrice}원</strong>/일
					</p>
				</h3>
				<ul style={{ margin: "10px 0" }}>
					{detail.sitter.category.map((v, i) => {
						return (
							<li key={`category_${i}`}>
								<label>
									<input type="checkbox" checked={services[i]} onChange={(e)=>{
                    setServices((prev)=>{
                      const new_data = [...prev];
                      new_data[i] = e.target.checked;
                      return new_data;
                    })
                  }}/>
									{v}
								</label>
							</li>
						);
					})}
				</ul>
				<div>
					<p>
						{dates.length > 0 &&
							dates?.map((v, i) => {
								return (
									<>
										{i > 0 ? ", " : ""}
										<span key={`date_${v}`} style={{ display: "inline-block" }}>
											{v}
										</span>
									</>
								);
							})}
					</p>
					<Calendar
            value={date && date}
            onChange={setDate}
            multiple={true}
            format="YYYY/MM/DD"
            minDate={new Date()}
            maxDate={new Date(today.year + 1, today.month.number, today.day)}
            shadow={false}
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
                <p>{v.petName}</p>
                <p>{v.petType}</p>
                <p>{v.petAge}</p>
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
        <MapContainer
          centerElement={{x: detail.sitter.x, y: detail.sitter.y, userName: detail.user.userName, reviewStar: detail.sitter.averageStar}}
          showOnly={true}
        />
        <p>{detail.sitter.address}</p>
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
                  value={date && date}
                  onChange={setDate}
                  multiple={true}
                  format="YYYY/MM/DD"
                  minDate={new Date()}
                  maxDate={
                    new Date(today.year + 1, today.month.number, today.day)
                  }
                  shadow={false}
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
        </ul>
        <div className="buttons">
          <button type="button">문의하기</button>
          <button type="button" onClick={requestReservation}>
            예약하기
          </button>
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
  border-top: 1px solid #ddd;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
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
    font-size: 16px;
    line-height: 40px;
    height: 36px;
    padding: 0 20px;
    cursor: pointer;
    & + li {
      border-top: 1px solid #ddd;
    }
    label {
      display: block;
      width: 100%;
    }
    span {
      font-weight: 700;
    }
    strong {
      font-size: 14px;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    background: #ddd;
    button {
      flex-basis: 50%;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
    }
  }
`;
const SitterDetailPage = styled.div`
  position: relative;
  line-height: 1.4;
  section {
    h3 {
      font-size: 20px;
      padding-bottom: 6px;
      border-bottom: 1px solid #333;
      margin-bottom: 15px;
    }
    & + section {
      padding: 30px 0 0;
      margin: 30px 0 0;
    }
    &:last-of-type {
      padding-bottom: 30px;
    }
    &.pets_info_section {
      ul {
        li {
          display: flex;
          align-items: center;
          gap: 20px;
          .pet_image {
            display: block;
            width: 50px;
            height: 50px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          & + li {
            margin-top: 20px;
          }
        }
      }
    }
  }
`;
const SitterProfile = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -25px;
  li {
    &.profile span {
      display: inline-block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border: 1px solid #ddd;
      box-sizing: border-box;
    }
  }
`;

export default Detail;
