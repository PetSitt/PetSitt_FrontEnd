import React, {Suspense, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom';
import io from "socket.io-client";
import styled from "styled-components";
import Router from './Router';
import "./assets/font/index.css"
import Menu from './components/Menu';
import ChatList from './page/ChatList';

const INITIAL_VALUES = {
  popup: false,
  socket: null,
  id: null,
  username: null
}
function App() {
  const location = useLocation();
  const [detailPageClass, sestDetailPageClass] = useState();
  const [value, setValues] = useState(INITIAL_VALUES);
  
 useEffect(()=>{
    // 디테일 페이지일 경우 Y축 scroll 대상 변경을 위한 클래스 세팅
    if(location.pathname.split('/')[1] === 'detail') sestDetailPageClass('isDetailPage');
    else sestDetailPageClass('');
  }, [location.pathname]);

  useEffect(() => {
    setValues((prev) => {
      return {
        ...prev,
        socket: io.connect(process.env.REACT_APP_SERVER, {transports: ['websocket'], upgrade: false})
      }
    })

    return () => {
      value.socket.disconnect();
      setValues((prev) => {
        return {
          ...prev,
          socket: null
        }
      });
    }
  },[]);
  return (
    <AppWrapper className="App">
      <div className={`AppInner ${detailPageClass}`}>
        <Suspense fallback={<div>로딩중!!</div>}>
          <Router />
        </Suspense>
        <Menu popup={value.popup} setPopup={setValues} socket={value.socket}/>
        {console.log(value.socket)}
        {value.popup && (
          <Suspense>
            <ChatList popup={value.popup} socket={value.socket} setPopup={setValues} />
          </Suspense>
        )}
      </div>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  height: 100vh;
  background: rgb(217, 227, 238);

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
      padding-bottom: 74px;
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
  }
`

export default App;
