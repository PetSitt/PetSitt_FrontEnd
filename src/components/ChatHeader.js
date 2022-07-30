import React from 'react';
import styled from 'styled-components';

const ChatHeader = ({socket, idRoom, popup, showChatRoom, setPopup}) => {
	return (
			<ChatHeaderInner className="chats_header">
				<h2 className="header">PetSitt</h2>
				<div className="close" onClick={() => setPopup((prev) => {
					socket.emit("leave_room", idRoom);
					return {
						...prev,
						popup:!popup
					}
				})}><i className="ic-close"></i></div>
			</ChatHeaderInner>
	);
};

const ChatHeaderInner = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	height: 60px;
	padding: 0 18px;
	background-color: rgba( 255,255,255,0.9 );
	display: flex;
	justify-content: space-between;
	align-items: center;
	/* width: 370px;
	max-width: 90%;
	min-height: 60px;
	position: fixed;
	padding: 0 18px;
	background-color: rgba( 255,255,255,0.9 );
	left: 0;
	right: 0;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 9;
	overflow: hidden;
	border-radius: 30px 30px 0px 0px;
	transform: translateZ(0px);
	border-bottom: 1px solid rgba(239, 239, 240, 0.8); */
	h2 {font-size: 20px;}
	.close {font-size: 20px; color: #fc9215; cursor: pointer;}
	/* @media (min-width: 768px){
		right: calc(10% + 21px);
		left: auto;
	} */
`
export default ChatHeader;