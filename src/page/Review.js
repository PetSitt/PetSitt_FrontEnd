import React, {useState} from 'react';
import styled from 'styled-components';

const Review = ({mode, reviewTextRef, reviewText, starRef, errorMessage, reviewData}) => {
  const [starLength, setStarLength] = useState();
  return (
    <ReviewPage>
      <section>
        <h3>{mode === 'write' ? '리뷰 작성' : '등록된 리뷰'}</h3>
        <div className="socreArea">
          { mode === 'write' ? (
              Array.from({length: 5}, (v, i) => <Star key={`star_${i}`} type="button" onClick={()=>{setStarLength(i+1); starRef.current = i+1}} className={(i+1 <= starLength || (starRef.current && i+1 <= starRef.current))&& 'isActive'}><i className='ic-star-v2'></i>{i+1}</Star>)
            ) : (
              Array.from({length: 5}, (v, i) => <Star key={`star_${i}`} type="button" className={(i+1 <= reviewData?.data?.star && 'isActive')}><i className='ic-star-v2'></i>{i+1}</Star>)
            )
          }
        </div>
        <div className="inputArea">
          {
            mode === 'write' ? (
              <textarea ref={reviewTextRef} placeholder='리뷰를 작성해주세요.' defaultValue={reviewTextRef && reviewText}></textarea>
            ) : (
              <textarea readOnly defaultValue={reviewData?.data?.reviewinfo}></textarea>
            )
          }
        </div>
        {
          mode === 'write' && <ErrorMessage>{errorMessage && errorMessage}</ErrorMessage>
        }
      </section>
    </ReviewPage>
  )
}

const ReviewPage = styled.div`
  h3{
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
    text-align: center;
  }
  .socreArea{
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
  }
  .inputArea{
    height: 140px;
    border: 1px solid #ddd;
    margin: 16px 0 0;
    border-radius: 6px;
    overflow: hidden;
    textarea{
      display: block;
      width: 100%;
      height: 100%;
      padding: 12px 16px;
      resize: none;
      font-size: 16px;
      &::placeholder{
        color:rgba(120,120,120,.7);
      }
    }
  }
`
const Star = styled.button`
  width: 30px;
  height: 30px;
  font-size: 0;
  i{
    font-size: 34px;
    color: #FC9215;
    opacity: .2;
  }
  &.isActive{
    i{
      opacity: 1;
    }
  }
`
const ErrorMessage = styled.p`
  font-size: 13px!important;
  align-self: flex-start;
  padding: 5px 0;
  color: #F01D1D;
  margin-top: 2px;
`;
export default Review;