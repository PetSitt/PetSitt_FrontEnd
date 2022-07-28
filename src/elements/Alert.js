import React from 'react';
import styled, {keyframes} from "styled-components";

const Alert = ({_text}) => {
  return (
    <AlertPage>
      <p>{_text}</p>
    </AlertPage>
  )
}

const alertAnimation = keyframes`
  0% {
    opacity: 0;
    margin-top: -44px;
  }
  10%{
    opacity: 1;
    margin-top: -54px;
  }
  90%{
    opacity: 1;
    margin-top: -54px;
  }
  100%{
    opacity: 0;
    margin-top: -44px;
  }
`
const AlertPage = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  width: auto;
  text-align: center;
  margin: -54px auto 0;
  animation: ${alertAnimation} ease-in-out 3s;
  animation-fill-mode: forwards;
  z-index: 100;
  pointer-events: none;
  @media (min-width: 768px){
		max-width: 412px;
    width: 100%;
		right: 10%;
		left: auto;
	}
  p{
    display: inline-block;
    font-size: 13px;
    line-height: 1.2;
    padding: 7px 14px;
    border-radius: 14px;
    color: #fff;  
    background-color: rgba(0,0,0,.6);
  }
`
export default Alert;