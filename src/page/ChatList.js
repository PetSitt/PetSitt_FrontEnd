import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { chatApis } from "../store/chatApi";
import ChatRoom from './ChatRoom';
import ChatHeader from "../components/ChatHeader";

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
};

function ChatList({popup, socket, setPopup, room, detailOnly}) {
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [idRoom, setIdRoom] = useState(detailOnly ? room : '');
  const [username, setUsername] = useState('');
  const { isLoading: dataLoading, data: chats, refetch } = useQuery("chatsList", () => chatApis.chatListGet(socket.id), {
    staleTime: Infinity,
    enabled: true
  });
  const joinRoom = (userName, room) => {
    socket.emit("join_room", room);
    setUsername(userName);
    setIdRoom(room);
    setShowChatRoom(true);
  };

  useEffect(() => {
    refetch();
  },[refetch])

  return (
    <ChatInner className={`chatsInner ${!showChatRoom ? "chatListInner": 'chatRoomInner'}`}>
        <div className="joinChatContainer">
          <ChatHeader socket={socket} idRoom={detailOnly ? room : idRoom} popup={popup} showChatRoom={showChatRoom} setPopup={setPopup}/>
          <ChatBody className={`${detailOnly ? 'detail_only' : ''} chats_body`}>
            {
              !detailOnly ? (
                <>
                  { !showChatRoom ? (
                  <>
                    {chats.data?.rooms ? 
                      (<div className="chatingList_inner">
                      <p className="txt_chating">채팅목록</p>
                      {chats.data?.rooms.map((el, idx) => {
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
                    </div>)
                    :
                    (<div className="chats_notice">
                      <p>대화 했던 내역이 없습니다.</p>
                      <p>원하는 돌보미를 찾아 문의 해보세요.</p>
                    </div>)}
                  </>
                  ) : (
                    <ChatRoom socket={socket} room={idRoom} popup={popup} showChatRoom={showChatRoom}/>
                  )}
                </>
              ) : (
                <ChatRoom className={'detailOnly'} socket={socket} room={idRoom} popup={popup} showChatRoom={showChatRoom}/>
              )
            }
            
          </ChatBody>
        </div>
    </ChatInner>
  );
};

const ChatBody = styled.div`
  height: 100%;
	-ms-overflow-style: none; /* IE and Edge - scrollbar 숨기기*/
	scrollbar-width: none; /* Firefox scrollbar 숨기기*/	
	overflow-Y: auto;
  -ms-overflow-style: none; /* IE and Edge - scrollbar 숨기기*/
  scrollbar-width: none; /* Firefox scrollbar 숨기기*/	
  padding: 0 14px;
`
const ChatInner = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 25px;
	width: 370px;
	max-width: 90%;
	height: 90%;
	max-height: 680px;
	border-radius: 30px;
	background-color: #eeeeee;
	margin: 0 auto;
	box-shadow: rgb(0 0 0 / 30%) 0px 12px 60px 5px;
	animation: boxFade 0.20s ease-out 0s 1 normal none running;
  overflow: hidden;
  z-index: 200;
  @media (min-width: 768px){
    right: calc(10% + 21px);
    left: auto;
  }
  &.chatRoomInner{
    padding-bottom: 56px;
    .chats_body{
      padding: 0;
      overflow-y: hidden;
      .chat-body{
        padding-bottom: 20px;
      }
    }
    .chatRoom{
      padding: 0 14px;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      -ms-overflow-style: none; /* IE and Edge - scrollbar 숨기기*/
      scrollbar-width: none; /* Firefox scrollbar 숨기기*/	
    }
  }
  .chats_body.detail_only{
    padding: 0 0 56px;
    overflow-y: hidden;
    & > div{
      padding: 0 14px 20px;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      -ms-overflow-style: none; /* IE and Edge - scrollbar 숨기기*/
      scrollbar-width: none; /* Firefox scrollbar 숨기기*/	
    }
  }
  .joinChatContainer{
    position: relative;
    padding-top: 80px;
    height: 100%;
    box-sizing: border-box;
  }
  .chatingList_inner {
    margin: 10px 0;
    padding: 12px 10px 6px 10px;
    background-color: rgb(255, 255, 255);
    border-radius: 18px;
    box-shadow: rgb(0 0 0 / 10%) 0px 2px 16px 1px;
    .txt_chating {
      font-size: 14px;
    }
  }
  .chats_notice {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    p {
      font-size: 14px;
      margin-bottom: 6px;
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
