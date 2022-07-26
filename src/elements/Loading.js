import React from 'react';
import styled, {keyframes} from 'styled-components';
import icon_loading from '../assets/img/icon_loading.png';

const Loading = ({_text, _position, _margin}) => {
  const style = {
    _position,
    _margin,
  };
  return (
    <LoadingBox {...style}>
      <i style={{backgroundImage: `url(${icon_loading})`}}></i>
      {
        _text && <p>{_text}</p>
      }
    </LoadingBox>
  )
}

Loading.defaultProps = {
  _position: 'fixed',
  _margin: '40px 0',
};

const loadingSpin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }

`
const LoadingBox = styled.div`
  position: ${(props) => props._position};
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;
  text-align: center;
  margin: ${(props) => props._margin};
  @media (min-width: 768px){
		max-width: 412px;
		right: ${(props) => props._position === 'relative' ? 0 : '10%'};
		left: ${(props) => props._position === 'relative' ? 0 : 'auto'};
	}
  i{
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