import React, {Suspense, useState, useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom';
import jwt_decode from "jwt-decode"
import styled from "styled-components";
import Router from './Router';
import "./assets/font/index.css"
import Menu from './components/Menu';
import Chat from './page/Chat';
import MarketingArea from './components/MarketingArea';
import LoadingBox from './elements/Loading';


function App() {
  const location = useLocation();
  const [detailPageClass, sestDetailPageClass] = useState();
  const [chatDisplay, setChatDisplay] = useState(false);
  const [newMessage, setNewMessage] = useState({status: false, lastText: null});
  const sseConnected = useRef(false);
  const [chatRoomOnly, setChatRoomOnly] = useState(false);
  
  useEffect(()=>{
    // 디테일 페이지일 경우 Y축 scroll 대상 변경을 위한 클래스 세팅
    if(location.pathname.split('/')[1] === 'detail') sestDetailPageClass('isDetailPage');
    else sestDetailPageClass('');

    if(!localStorage.getItem('accessToken')) {
      setNewMessage({status: false, lastText: null});
    }
  }, [location.pathname]);
  
  useEffect(()=>{
    const accessToken = localStorage.getItem('accessToken');
    // accessToken 없고 로그인 페지 아닐 경우에만 EventSource 요청
    if(accessToken && location.pathname !== '/login'){
      const userEmail = jwt_decode(localStorage.getItem('accessToken')).userEmail;
      const eventSource = new EventSource(`https://kimguen.com/chats/sse/${userEmail}`);
      eventSourceRef.current = eventSource;
    }
  },[]);

  const eventSourceRef = useRef();
  useEffect(()=>{
    if(eventSourceRef.current && !sseConnected.current){
      // eventSource 연결되었을 경우 && 한 번만 요청되도록 sseConnected Boolean값 확인
      sseConnected.current =  true;
      eventSourceRef.current.addEventListener('open', function(e) {
        // console.log("접속이 되었습니다!!!!!");
      });
      eventSourceRef.current.addEventListener('message', function(e) {
        // console.log("메세지가 도착했습니다!!!", JSON.parse(e.data));
        if(JSON.parse(e.data).newMessage){
          setNewMessage({status: true, lastText: e.data.lastChat});
        }
        else setNewMessage(()=>{
          setNewMessage({status: false, lastText: e.data.lastChat});
        })
      });
    }
  },[eventSourceRef.current]);

  useEffect(()=>{
    if(chatRoomOnly.status){
      setChatDisplay(true);
    }
  },[chatRoomOnly]);

  useEffect(()=>{
    if(!chatDisplay){
      setChatRoomOnly({status: false, roomId: null, sender: null});
    }
  },[chatDisplay])

  return (
    <AppWrapper className="App">
      <div className={`AppInner ${detailPageClass}`}>
        <Suspense fallback={<div className='loading'><LoadingBox /></div>}>
          <Router setChatRoomOnly={setChatRoomOnly}/>
        </Suspense>
        <Menu chatDisplay={chatDisplay} setChatDisplay={setChatDisplay} newMessage={newMessage}/>
        {
          chatDisplay && (
            <Suspense fallback={<div className='loading'><LoadingBox /></div>}>
              <Chat setChatDisplay={setChatDisplay} newMessage={newMessage} setNewMessage={setNewMessage} chatRoomOnly={chatRoomOnly}/>
            </Suspense>
          )
        }
      </div>
      <MarketingArea _display={true}></MarketingArea>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  height: 100vh;
  background: rgb(217, 227, 238);
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .AppInner::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera scrollbar 숨기기*/
  }
  .AppInner{
    width: 100%;
    height: 100%;
    -ms-overflow-style: none; /* IE and Edge scrollbar 숨기기*/
    scrollbar-width: none; /* Firefox scrollbar 숨기기*/
    background-color: #fff;
    box-sizing: border-box;
    & > div:first-of-type,
    & > section:first-of-type {
      min-height: 100%;
      padding: 20px;
      box-sizing: border-box;
      padding-bottom: 70px;
    }
    & > .home:first-of-type {
      padding-bottom: 134px;
    }
    & > .detail:first-of-type {
      padding: 0 20px 20px;
    }
    @media (min-width:768px) {
      max-width: 412px;
      position: absolute;
      right: 10%;
      top: 0%;
      overflow: hidden;
      overflow-y: auto;
    }
    &.isDetailPage{
      overflow: hidden;
    }
    & + .marketingPage{
      @media (max-width:767px) {
        display: none!important;
      }
      
    }
  }
`

export default App;
