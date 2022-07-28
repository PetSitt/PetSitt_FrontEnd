import React,{useRef} from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Reservation = () => {
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  
  
  return (
    <ReservationPage>
      <label>
      <input ref={inputRef1} type="file" onChange={(e)=>{
      }}/>
      </label>
      <label>
      <input ref={inputRef2} type="file" onChange={(e)=>{
      }}/>
      </label>

      <button type='button' onClick={()=>{
        // const data = {test: ["첫번째", "두번째"]}
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        

        const image_1 = inputRef1.current.files[0];
        const image_2 = inputRef2.current.files[0];
        const imageArr = [image_1, image_2];
        const arr = ["첫번째", "두번째"];
        const formData = new FormData();
        formData.append('diaryImage', imageArr);
        formData.append('test', JSON.stringify(arr));
        axios.post('http://15.165.160.107/diarys/tests', formData, config).then(
          res=>{
          }
        ).catch((err) => {
          if (err.response) {
            // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
          } else if (err.request) {
            // 요청이 전송되었지만, 응답이 수신되지 않았습니다.
            // 'error.request'는 브라우저에서 XMLHtpRequest 인스턴스이고,
            // node.js에서는 http.ClientRequest 인스턴스입니다.
          } else {
            // 오류가 발생한 요청을 설정하는 동안 문제가 발생했습니다.
          }
        });
      }}>전송</button>
    </ReservationPage>
  )
}

const ReservationPage = styled.div`

`
export default Reservation;