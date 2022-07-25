import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useQueryClient } from "react-query";
import {apis} from '../store/api';


const Reviews = ({reviewCount, sitterId}) => {
  const [reviews, setReviews] = useState(null);
  const reviewIdValue = useRef(0);

  const getReviewApi = (sitterId, reviewId) => {
    console.log(sitterId, reviewId)
    return apis.getReviews(sitterId, reviewId);
  }
  const {data: reviewsData, refetch: refetchReviews} = useQuery(['reviewsData', sitterId, reviewIdValue.current], ()=>getReviewApi(sitterId, {reviewId: reviewIdValue.current}), {
    onSuccess: (data) => {
      console.log(data,'review loading success')
    },
    onError: (data) => {
      //console.error(data);
    },
    staleTime: Infinity,
  })
  const lastReviewRef = useRef(0);
  console.log(reviews)

  useEffect(()=>{
    if(reviewsData?.data.reviews.length > 0){
      setReviews((prev)=>{
        const _new_added = reviewsData.data.reviews.map(v=>{
          const _date = v.reviewDate.toString().split("T")[0]
          .split('-').join('/');
          const _time = v.reviewDate.toString().split("T")[1].split('.')[0];
          return {...v, date: _date, time: _time};
        })
        if(prev?.length > 0){
          const _new = [...prev];
          return [..._new, ..._new_added];
        }else{
          return [..._new_added]
        }
      });
    }
  },[reviewsData])

  if(!reviews) return null;
  return (
    <>
      <ul>
        {reviews.map((v, i) => {
          return (
            <li key={`review_${i}`} ref={(i === reviews.length-4) ? lastReviewRef : null}>
              <div>
                <span className="name">{v.userName}</span>
                <span><i className="ic-star" style={{fontSize: '14px'}}></i><em style={{margin: '0 10px 0 3px'}}>{v.reviewStar}</em></span>
                <span style={{color: '#676767'}}>{v.date}</span>
                <span style={{color: '#676767', marginLeft: '6px'}}>{v.time}</span>
              </div>
              <p>{v.reviewInfo}</p>
            </li>
          );
        })}
      </ul>
      {
        (reviews.length < reviewCount) && (
          <div style={{textAlign: 'center', paddingTop: '40px'}}>
            <button type="button" className="more_review" onClick={()=>{reviewIdValue.current = reviews[reviews.length-1].reviewId; refetchReviews()}}>리뷰 더보기</button>
          </div>
        )
      }
    </>
  )
}

export default Reviews;