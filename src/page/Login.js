import React from 'react';
import axios from 'axios';

const Login = () => {


//   axios.post('http://3.35.135.160/api/signup', {
//     userEmail: "new123@dev.com",
//     userName: "김하연",
//     password: "test1111",
//     phoneNumber: "01011111111",
//     basicAddress: "서울 마포구 합정동 381-31", 
//     detailAddress: "서울 마포구 합정동 381-31 그레이스 오피스텔",
//     region_1 : "040",
//     region_2 : "70",
//     location: { type: "Point", coordinates:[ 126.91251502008, 37.5481391150537 ] }
// })

axios.post('http://3.35.135.160/api/login', {
  userEmail: "new123@dev.com",
  password: "$2b$10$1TxkSN4i0b/xrbLGAiSRsuBss/RNtD8qfKFm0iNOWyjjaZtJHr7LK"
}).then(
  res => {
    console.log(res)
  }
)
   



  return (
    <>
      <input />
      <input />
    </>
  )
}

export default Login;