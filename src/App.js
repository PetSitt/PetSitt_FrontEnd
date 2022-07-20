import React, {Suspense, useState} from 'react'
import Router from './Router';
import styled from "styled-components";
import "./assets/font/index.css"
import Menu from './components/Menu';
import Chat from './page/Chat';


function App() {
  const [popup, setPopup] = useState(false);
  return (
    <AppWrapper className="App">
      <div className='AppInner'>
        <Suspense fallback={<div>로딩중!!</div>}>
          <Router />
        </Suspense>
        <Menu popup={popup} setPopup={setPopup}/>
        {popup && ( 
          <Chat popup={popup} setPopup={setPopup}/>
        )}
      </div>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  height: 100vh;
  overflow: hidden;
  background: rgb(217, 227, 238);

  .AppInner{
    width: 100%;
    height: 100%;
    & > div:first-of-type,
    & > section:first-of-type {
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      background-color: #fff;
      overflow: hidden;
      overflow-y: auto;
      padding-bottom: 74px;
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
