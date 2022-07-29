import React, {Suspense, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom';
import io from "socket.io-client";
import styled from "styled-components";
import Router from './Router';
import "./assets/font/index.css"
import Menu from './components/Menu';
import ChatList from './page/ChatList';
import MarketingArea from './components/MarketingArea';
import LoadingBox from './elements/Loading';

const INITIAL_VALUES = {
  popup: false,
  id: null,
  username: null
}
function App() {
  const location = useLocation();
  const [detailPageClass, sestDetailPageClass] = useState();
  const [value, setValues] = useState(INITIAL_VALUES);
  let socket = io.connect(process.env.REACT_APP_SERVER, {transports: ['websocket'], upgrade: false})
  
 useEffect(()=>{
    // 디테일 페이지일 경우 Y축 scroll 대상 변경을 위한 클래스 세팅
    if(location.pathname.split('/')[1] === 'detail') sestDetailPageClass('isDetailPage');
    else sestDetailPageClass('');
  }, [location.pathname]);


  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    }
  },[]);
  return (
    <AppWrapper className="App">
      <div className={`AppInner ${detailPageClass}`}>
        <Suspense fallback={<div className='loading'><LoadingBox /></div>}>
          <Router socket={socket} />
        </Suspense>
        <Menu popup={value.popup} socket={socket} setPopup={setValues} />
        <Suspense>
          <ChatList popup={value.popup} socket={socket} setPopup={setValues} />
        </Suspense>
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
      @media (max-width:768px) {
        display: none!important;
      }
      
    }
  }
`

export default App;
