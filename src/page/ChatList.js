import { useEffect, useState, useRef } from "react";
import { useQuery } from "react-query";
import styled, {keyframes} from "styled-components";
import { chatApis } from "../store/chatApi";
import ChatRoom from './ChatRoom';

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
};

function ChatList({popup, socket, setPopup}) {
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [idRoom, setIdRoom] = useState(null);
  const [username, setUsername] = useState(null);

  const { isLoading: dataLoading, data: chats } = useQuery("chatsList", chatApis.chatListGet, {
    staleTime: Infinity,
    enabled: true
  });

  const joinRoom = (userName, room) => {
    socket.emit("join_room", room);
    setUsername(userName);
    setIdRoom(room);
    setShowChatRoom(true);
  };

  const [scroll, setScroll] = useState();
  const scrollElement = useRef();

  return (
    <ChatInner ref={scrollElement} onScroll={(e)=>{
      setScroll(e.target.scrollTop);
    }}>
        <div className="joinChatContainer">
          <div>
            <div className={`chats_header ${!showChatRoom ? "list" : "room"}`}>
              <h2 className="header">PetSitt</h2>
              <div className="close" onClick={() => setPopup((prev) => {
                socket.emit("leave_room", idRoom);
                return {
                  ...prev,
                  popup:!popup
                }
              })}><i className="ic-close"></i></div>
            </div>
            {!showChatRoom ? (
            <div className="chatingList_inner">
              <p className="txt_chating">채팅목록</p>
              {chats.data.rooms.map((el, idx) => {
                return (
                  <div key={el.roomId} className="items">
                    <button onClick={() => {joinRoom(el.userName, el.roomId)}}>
                      <div className="imgurl_inner">
                        <span className="bg_img" style={{backgroundImage: `url(${el.imageUrl})`}}></span>
                      </div>
                      <div>
                        <p>{el.userName}</p>
                        <p>{formatDate(el.lastChatAt)}</p>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
            ) : (
              <ChatRoom socket={socket} room={idRoom} scroll={scroll} scrollElement={scrollElement}/>
            )}
          </div>
        </div>
    </ChatInner>
  );
};
const boxFade = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
`
const ChatInner = styled.div`
  position: fixed;
  bottom: 25px;
  width: 370px;
  max-width: 90%;
  height: 90%;
  max-height: 680px;
  overflow-y: auto;
  border-radius: 30px;
  background-color: #eeeeee;
  padding: 0 14px;
  margin: 0 auto;
  box-shadow: rgb(0 0 0 / 30%) 0px 12px 60px 5px;
  animation: ${boxFade} 0.20s ease-out 0s 1 normal none running;
  z-index: 99;
  -ms-overflow-style: none; /* IE and Edge - scrollbar 숨기기*/
  scrollbar-width: none; /* Firefox scrollbar 숨기기*/
  left: 0;
  right: 0;
  padding-bottom: 40px;
  @media (min-width: 768px){
    right: calc(10% + 21px);
    left: auto;
  }
  /* @media (min-width:320px) {
    &, .chats_header{right: 7%;}
    .chat-footer{right: 9.6%;}
  } */
  /* @media (min-width:768px) {
    &, .chats_header{right: 11%;}
    .chat-footer{right: 11.6%;}
  } */

  .chats_header.list {
    width: 100%;
    height: 60px;
    min-height: 60px;
  }
  .chats_header.room {
    width: 370px;
    max-width: 90%;
    min-height: 60px;
    position: fixed;
    padding: 0 18px;
    background-color: rgba( 255,255,255,0.9 );
    left: 0;
    right: 0;
    margin: 0 auto;
    @media (min-width: 768px){
      right: calc(10% + 21px);
      left: auto;
    }
  }
  .chats_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 9;
    overflow: hidden;
    border-radius: 30px 30px 0px 0px;
    transform: translateZ(0px);
    border-bottom: 1px solid rgba(239, 239, 240, 0.8);
    h2 {font-size: 20px;}
    .close {font-size: 20px; color: #fc9215; cursor: pointer;}
  }
  .chatingList_inner {
    margin-top: 10px;
    padding: 12px 10px 6px 10px;
    background-color: rgb(255, 255, 255);
    border-radius: 18px;
    box-shadow: rgb(0 0 0 / 10%) 0px 2px 16px 1px;
    .txt_chating {
      font-size: 14px;
    }
  }
  .items {
    margin-top: 14px;
    display: flex;
    align-items: center;
  }
  .items .imgurl_inner{
    width: 50px;
    height: 50px;
    border-radius: 10px;
    margin-right: 10px;
    overflow: hidden;
  }
  .items .imgurl_inner .bg_img{
    display: block;
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
  }
`

export default ChatList;
