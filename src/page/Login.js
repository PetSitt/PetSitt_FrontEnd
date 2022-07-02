import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {Cookies} from 'react-cookie';
import {apis} from '../store/api_test';
import {apis_local} from '../store/api_local';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const Login = () => {
const queryClient = useQueryClient();
const cookies = new Cookies();
const email_ref = useRef();
const pw_ref = useRef();


const getSitters = () => {
  return apis_local.getSitters();
}
const addSitterQuery = (data) => {
  return apis_local.addSitter(data);
}
const login = (data) => {
  return apis.login(data);
}
const checkUserQuery = () => {
  return apis.checkUser();
}


// const getSittersQuery = useQuery('sitters_list', getSitters, {
//   onSuccess: (data) => {
//     console.log(data);
//   }, 
// })
const {mutate: addSitter} = useMutation(addSitterQuery, {
  onSuccess: (data) => {
    console.log(data, 'sitter');
    queryClient.invalidateQueries('sitters_list');
  }
})
const {mutate: loginQuery} = useMutation(login, {
  onSuccess: (data) => {
    console.log(data)
    cookies.set('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
  },
  onError: (data) => {
    alert(data.response.data.errorMessage);
  }
});
const {mutate: checkUser} = useMutation(checkUserQuery, {
  onSuccess: (data)=>{
    console.log(data);
  },
  onError: (data)=>{
    console.log(data, data.response.data.errorMessage)
  }
});


useEffect(()=>{
  // checkUser();
}, []);


// axios.post('http://3.35.135.160/api/login', {
//   userEmail: "new123@dev.com",
//   password: "$2b$10$1TxkSN4i0b/xrbLGAiSRsuBss/RNtD8qfKFm0iNOWyjjaZtJHr7LK",
// })

   


  // if (getSittersQuery.isLoading) return null;
  return (
    <>
      <input ref={email_ref} style={{ border: '1px solid #333'}}/>
      <input ref={pw_ref} style={{ border: '1px solid #333'}}/>
      <button type="button" onClick={()=>{
        const data = {userEmail: email_ref.current.value, password: pw_ref.current.value};
        loginQuery(data);
      }}>데이터 전송</button>
      <button type="button" onClick={()=>{
        const data = 	{
          "objectIdsitterId" : "s2dadwd2s4332",
          "userName": "세번째 네번째",
          "address": "react query 테스트",
          "sitterTitle": "eact query 테스트 eact query 테스트 eact query 테스트 eact query 테스트",
          "star" : 2.0,
          "location": { 
              "coordinates": [127.02079678472444, 37.490413948014606]
          }
        }
        addSitter(data)
      }}>시터 추가</button>
      {/* <ul>
        {
          getSittersQuery.data.data.map((v,i)=>{
            return (
              <li key={i}>{v.address}</li>
            )
          })
        }
      </ul>   */}
    </>
  )
}

export default Login;