import React, {Suspense} from 'react'
import Router from './Router';
import styled from "styled-components";
import "./assets/font/index.css"
import Menu from './components/Menu';

function App() {
  return (
    <AppWrapper className="App">
      <div className='AppInner'>
        <Suspense fallback={<div>로딩중!!</div>}>
          <Router />
        </Suspense>
        <Menu />
      </div>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  height: 100vh;
  background: rgb(217, 227, 238);
  overflow: hidden;
  .AppInner{
    width: 100%;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    background-color: #fff;
    overflow: hidden;
    overflow-y: auto;

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
