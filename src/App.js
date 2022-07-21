import React, {Suspense, useState, useContext} from 'react'
import io from "socket.io-client";
import styled from "styled-components";
import Router from './Router';
import "./assets/font/index.css"
import Menu from './components/Menu';
import Chat from './page/Chat';

function App() {
  const socket = io.connect("http://3.39.230.232");
  const [popup, setPopup] = useState(false);
  
  return (
    <AppWrapper className="App">
      <div className='AppInner'>
        <Suspense fallback={<div>로딩중!!</div>}>
          <Router />
        </Suspense>
        <Menu popup={popup} setPopup={setPopup} socket={socket}/>
        {popup && ( 
          <Suspense>
            <Chat popup={popup} setPopup={setPopup}/>
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
    & > div:first-of-type,
    & > section:first-of-type {
      padding: 20px;
      box-sizing: border-box;
      background-color: #fff;
      padding-bottom: 74px;
    }
    & > .home:first-of-type,
    & > .detail:first-of-type {
      height: auto;
    }
    @media (min-width:768px) {
      max-width: 412px;
      position: absolute;
      right: 10%;
      top: 0%;
      overflow: hidden;
      overflow-y: auto;
    }
  }
`

export default App;
