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
              Array.from({length: 5}, (v, i) => <Star key={`star_${i}`} type="button" onClick={()=>{setStarLength(i+1); starRef.current = i+1}} className={(i+1 <= starLength || (starRef.current && i+1 <= starRef.current))&& 'isActive'}>{i+1}</Star>)
            ) : (
              Array.from({length: 5}, (v, i) => <Star key={`star_${i}`} type="button" className={(i+1 <= reviewData?.data?.star && 'isActive')}>{i+1}</Star>)
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
    margin-bottom: 15px;
    text-align: center;
  }
  .socreArea{
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
  }
  .inputArea{
    height: 200px;
    border: 1px solid #ddd;
    margin: 20px 0;
    textarea{
      display: block;
      width: 100%;
      height: 100%;
      padding: 10px;
      resize: none;

    }
  }
`
const Star = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #fc9215;
  &.isActive{
    background-color: #fc9215;
  }
`
const ErrorMessage = styled.p`
  font-size: 13px;
  align-self: flex-start;
  padding: 5px 0;
  color: #F01D1D;
`;
export default Review;