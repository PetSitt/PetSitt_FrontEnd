import React, {Suspense, useEffect, useState} from 'react'
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
  const [value, setValues] = useState(INITIAL_VALUES);

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
      <div className='AppInner'>
        <Suspense fallback={<div>로딩중!!</div>}>
          <Router />
        </Suspense>
        <Menu popup={value.popup} setPopup={setValues} socket={value.socket}/>
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
    & > div:first-of-type,
    & > section:first-of-type {
      height: 100%;
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
      overflow: auto;
    }
  }
`

export default App;
