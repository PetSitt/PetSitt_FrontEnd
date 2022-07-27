import React from 'react';
import styled, {keyframes} from 'styled-components';
import icon_loading from '../assets/img/icon_loading.png';

const Loading = ({_text}) => {
  return (
    <LoadingBox>
      <i style={{backgroundImage: `url(${icon_loading})`}}></i>
      {
        _text && <p>{_text}</p>
      }
    </LoadingBox>
  )
}


const loadingSpin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }

`
const LoadingBox = styled.div`
  width: 100%;
  text-align: center;
  i{
    display: inline-block;
    width: 40px;
    height: 40px;
    background-size: 40px 40px;
    background-repeat: no-repeat;
    background-position: center;
    animation: ${loadingSpin} linear 1s;
    animation-iteration-count: infinite;
  }
  p{
    font-size: 16px;
    font-weight: 500;
    word-break: keep-all;
    line-height: 1.3;
    margin: 20px auto 0;
    max-width: 80%;
  }
`
export default Loading;