import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { chatApis } from "../store/chatApi";
import ChatRoom from './ChatRoom';
import '../styles/chat.css';
import ChatHeader from "../components/ChatHeader";

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
};

function ChatList({popup, socket, setPopup}) {
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [idRoom, setIdRoom] = useState('');
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
          <div>
            <ChatHeader socket={socket} idRoom={idRoom} popup={popup} showChatRoom={showChatRoom} setPopup={setPopup}/>
            {!showChatRoom ? (
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
              <ChatRoom socket={socket} room={idRoom} idRoom={idRoom} popup={popup} showChatRoom={showChatRoom} setPopup={setPopup}/>
            )}
          </div>
        </div>
    </ChatInner>
  );
};

const ChatInner = styled.div`
  @media (min-width: 768px){
    right: calc(10% + 21px);
    left: auto;
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
