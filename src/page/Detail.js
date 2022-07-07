import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {useQuery} from 'react-query';
import styled from 'styled-components';
import DatePicker, { DateObject, Calendar } from "react-multi-date-picker";
import MapContainer from './MapContainer';

import {apis} from '../store/api';

const Detail = () => {
  // 62c63d6f25208ae3d3cda472
  const param = useParams();
  const sitterId = param.id;
  const [detail, setDetail] = useState();
  const today = new DateObject();
  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState(new Date());
  const selectedServicesRef = useRef();
  const selectedDatesRef = useRef();
  const [reviews, setReviews] = useState(
    [{
      userName : "김대한",
      reviewStar: 4.0,
      reviewDate: "2022/06/29",
      reviewInfo: "1000글자 제한 리뷰",
    }, {
      userName : "김민국",
      reviewStar: 5.0,
      reviewDate: "2022/06/28",
      reviewInfo: "1000글자 제한 리뷰적어요!",
    }]
  )

  const {isLoading: detailIsLoading, isSuccess, data: detailData} = useQuery('detail_data', () => apis.getUserDetail(sitterId), {
    onSuccess: (data) =>{
      console.log(data.data,'data');
    },
    onError: (data) => {
      console.error(data);
    },
    staleTime: Infinity,
  })
  useEffect(()=>{
    setDetail(detailData.data);
  },[isSuccess])

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
		if (date.length >= 0) {
      console.log(date, date.length)
			const getDates = date.map((v) => {
				return v.format(v._format);
			});
			setDates(getDates);
		}
	}, [date]);
  
  if(detailIsLoading || !detail) return <p>로딩중입니다</p>;
  return (
    <SitterDetailPage>
      <section>
        <img src={detail.sitter.mainImageUrl} style={{maxWidth: '100%'}}/>
        <SitterProfile>
          <li className="profile">
            <span style={{backgroundImage: `url(${detail.user.userImage})`}}></span>
          </li>
          <li className="userName">{detail.user.userName}</li>
          <li className="score">평균 평점 {detail.sitter.averageStar}</li>
          <li><strong>{detail.sitter.servicePrice}원</strong><span>/일</span></li>
          <li>재고용률: <strong>{detail.sitter.rehireRate}%</strong></li>
          <li>{detail.sitter.introTitle}</li>
          <li>{detail.sitter.myIntro}</li>
        </SitterProfile>
      </section>
      <section>
        <h3 style={{display: 'flex', justifyContent: 'space-between'}}>서비스 예약하기 <p style={{fontSize: '16px'}}><strong>{detail.sitter.servicePrice}원</strong>/일</p></h3>
        <ul style={{margin: '10px 0'}}>
          {
            detail.sitter.category.map((v,i)=>{
              return (
                <li key={`category_${i}`}>
                  <label><input type="checkbox"/>{v}</label>
                </li>
              )
            })
          }
        </ul>
        <div>
          <p>
          {
            (dates.length > 0) && (
              dates?.map((v,i)=>{
                return (
                  <>
                    {i > 0 ? ', ' : ''}
                    <span key={`date_${v}`} style={{display: 'inline-block'}}>
                      {v}
                    </span>
                  </>
                )
              })
            )
          }
          </p>
          <Calendar
            onChange={setDate}
            multiple={true}
            format="YYYY/MM/DD"
            minDate={date}
            maxDate={new Date(today.year + 1, today.month.number, today.day)}
            shadow={false}
          />
        </div>
      </section>
      <section>
        <h3>서비스 가능한 반려견 사이즈</h3>
        <ul>
          {
            detail.sitter.careSize.map((v,i)=>{
              return(
                <li key={`careSize_${i}`}>
                { v && (
                  i === 0 ? '소' : i === 1 ? '중' : '대'
                )}
              </li>
              )
            })
          }
        </ul>
      </section>
      <section>
        <h3>추가 제공 가능한 서비스</h3>
        <ul>
          {
            detail.sitter.plusService.map((v,i)=>{
              return(
                <li key={`plusService_${i}`}>{v}</li>
              )
            })
          }
        </ul>
      </section>
      <section className="pets_info_section">
        <h3>{detail.user.userName}님과 함께사는 반려견</h3>
        <ul>
          {
            detail.pets.map((v,i)=>{
              return(
                <li key={`pet_${i}`}>
                  <span className="pet_image" style={{backgroundImage: `url(${v.petImage})`}}></span>
                  <p>{v.petName}</p>
                  <p>{v.petType}</p>
                  <p>{v.petAge}</p>
                </li>
              )
            })
          }
        </ul>
      </section>
      <section className="pets_info_section">
        <h3>{detail.user.userName}님에 대한 후기</h3>
        <ul>
          {
            reviews.map((v,i)=>{
              return(
                <li key={`review_${i}`}>
                  <div>
                    <span>{v.userName}</span>
                    <span>{v.reviewStar}</span>
                    <span>{v.reviewDate}</span>
                  </div>
                  <p>{v.reviewInfo}</p>
                </li>
              )
            })
          }
        </ul>
      </section>
      <section>
        <MapContainer centerElement={[detail.sitter.x, detail.sitter.y]} showOnly={true}/>
        <p>{detail.sitter.address}</p>
      </section>
      <BottomButtons>
        <ul>
        <li>
            <p>서비스 선택하기</p>
            <p ref={selectedServicesRef}></p>
          </li>
          <li>
            <p>날짜 선택하기</p>
            <p ref={selectedDatesRef}></p>
          </li>
        </ul>
        <div>
        <button type="button">문의하기</button>
        <button type="button">예약하기</button>
        </div>
      </BottomButtons>
    </SitterDetailPage>
  )
}

const BottomButtons = styled.div`
  li p{
    font-size: 16px;
  }
`
const SitterDetailPage = styled.div`
  line-height: 1.4;
  section{
    h3{
      font-size: 20px;
      padding-bottom: 6px;
      border-bottom: 1px solid #333;
      margin-bottom: 15px;
    }
    &+section{
      padding: 30px 0 0;
      margin: 30px 0 0;
    }
    &.pets_info_section{
      ul{
        li{
          display: flex;
          align-items: center;
          gap: 20px;
          .pet_image{
            display: block;
            width: 50px;
            height: 50px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          &+li{
            margin-top: 20px;
          }
        }
      }
    }
  }
`
const SitterProfile = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -25px;
  li{
      &.profile span{
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
`


export default Detail;