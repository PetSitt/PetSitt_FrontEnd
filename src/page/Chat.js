import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled, {keyframes} from "styled-components";
import ChatRoom from "../components/ChatRoom";
import { chatApis } from "../store/chatApi";

function Chat({popup, setPopup}) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const { isLoading: dataLoading, data: chats } = useQuery("chats", chatApis.chatListGet, {
    onSuccess: (data) => {
      console.log("success1:", data);
    },
    onError: (data) => {
      console.error("onErrord", data);
    }
  });

  useEffect(() => {
    console.log("success2:", chats)
  },[])

  return (
    <ChatInner>
      {!showChat ? (
        <div className="joinChatContainer">
          <div>
            <div className="chats_header">
              <h2 class="header">PetSitt</h2>
              <div className="close" onClick={() => setPopup(!popup)}><i className="ic-close"></i></div>
            </div>
            {chats.data.rooms.map((el, idx) => {
              return (
                <div key={idx} className="items">
                  <div className="imgurl_inner">
                    <span className="bg_img" style={{backgroundImage: `url(${el.imageUrl})`}}></span>
                  </div>
                  <div>
                    <p>{el.userName}</p>
                    <p>{el.lastChatAt}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <ChatRoom username={username} room={room} />
      )}
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
  right: 11%;
  width: 370px;
  height: 80%;
  min-height: 520px;
  max-height: 680px;
  overflow-y: auto;
  border-radius: 30px;
  padding: 10px 20px;
  background-color: #eeeeee;
  box-shadow: rgb(0 0 0 / 30%) 0px 12px 60px 5px;
  animation: ${boxFade} 0.20s ease-out 0s 1 normal none running;
  z-index: 99;
  -ms-overflow-style: none; /* IE and Edge - scrollbar 숨기기*/
  scrollbar-width: none; /* Firefox scrollbar 숨기기*/
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera - scrollbar 숨기기*/
  }
  .chats_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 60px;
    h2 {font-size: 20px;}
    .close {font-size: 20px; color: #fc9215; cursor: pointer;}
  }
  .items {
    display: flex;
    align-items: center;
    margin-top: 14px;
    background-color: rgb(255, 255, 255);
    border-radius: 18px;
    box-shadow: rgb(0 0 0 / 10%) 0px 2px 16px 1px;
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

export default Chat;
