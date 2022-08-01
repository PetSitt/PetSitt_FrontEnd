import React from 'react';
import styled from 'styled-components';

const ChatHeader = ({setChatDisplay}) => {
	return (
		<ChatHeaderWrap>
			<p>채팅</p>
			<button type='button' onClick={()=>{
				setChatDisplay(false);
			}}>닫기</button>
		</ChatHeaderWrap>
	);
};

const ChatHeaderWrap = styled.div`
position: fixed;
left: 0;
right: 0;
top: 0;
width: 100%;
padding: 20px;
background-color: #fff;
@media (min-width: 768px){
	max-width: 412px;
	right: 10%;
	left: auto;
}
	p{
		font-weight: 700;
    font-size: 24px;
    line-height: 29px;
	}
	button{
		position: absolute;
		right: 20px;
		top: 20px;
		width: 24px;
		height: 24px;
		font-size: 0;
		&::before,
		&::after{
			position: absolute;
			left: 0;
			right: 0;
			top: 50%;
			width: 24px;
			height: 1px;
			background-color: #000;
			margin: 0 auto;
			content: '';
			transform: rotate(-45deg);
		}
		&::after{
			transform: rotate(45deg);
		}
	}
`
export default ChatHeader;