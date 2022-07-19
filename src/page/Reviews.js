import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useQueryClient } from "react-query";
import {apis} from '../store/api';


const Reviews = ({reviewCount, sitterId}) => {
  const [reviews, setReviews] = useState();
  const reviewIdValue = useRef(0);
  const {data: reviewsData, refetch: refetchReviews} = useQuery(['reviewsData', sitterId, reviewIdValue.current], () => apis.getReviews(sitterId, {reviewId: reviewIdValue.current}), {
    onSuccess: (data) => {
      console.log(data,'review loading success')
    },
    onError: (data) => {
      //console.error(data);
    },
    staleTime: Infinity,
    refetchOnMount: 'always',
  })
  const lastReviewRef = useRef();

  useEffect(()=>{
    if(reviewsData?.data.reviews.length > 0){
      setReviews((prev)=>{
        const _new_added = reviewsData.data.reviews.map(v=>{
          const _date = new Date(v.reviewDate)
          .toISOString().split("T")[0]
          .split('-').join('/');
          const _time = new Date(v.reviewDate)
          .toISOString().split("T")[1].split('.')[0];
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

  // useEffect(()=>{
  //   if(lastReviewRef.current){
  //     document.querySelector(".AppInner").scrollTo(0,lastReviewRef?.current.offsetTop);
  //   }    
  // },[reviews])

  useEffect(()=>{
    setReviews(null);
    reviewIdValue.current = 0;
    return () => {
      setReviews(null);
      reviewIdValue.current = 0;
    }
  },[])


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
            <button type="button" className="more_review" onClick={()=>{reviewIdValue.current = reviews[reviews.length-1].id; refetchReviews()}}>리뷰 더보기</button>
          </div>
        )
      }
    </>
  )
}

export default Reviews;