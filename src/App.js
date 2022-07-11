import React, {Suspense} from 'react'
import Router from './Router';
import styled from "styled-components";

function App() {
  return (
    <AppWrapper className="App">
      <div className='AppInner'>
        <Suspense fallback={<div>로딩중!!</div>}>
          <Router />
        </Suspense>
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
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
    background-color: #fff;

    @media (min-width:768px) {
      max-width: 412px;
      position: relative;
      left: 27%;
      top: 0%;
      overflow: auto;
    }
  }
`

export default App;
