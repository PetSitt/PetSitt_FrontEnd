import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled, {keyframes} from "styled-components";
import ChatRoom from "../components/ChatRoom";
import { chatApis } from "../store/chatApi";

function Chat({popup, setPopup}) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatsdata, setChatsdata] = useState([]);

  const { isLoading: dataLoading, data: chats } = useQuery("chats", chatApis.chatListGet, {
    onSuccess: (data) => {
      console.log("success1:", data);
      setChatsdata(data)
    },
    onError: (data) => {
      console.error("onErrord", data);
    }
  });

  console.log("success2:", chats)
  console.log("success3:", chatsdata)

  return (
    <ChatInner>
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <button onClick={() => setPopup(!popup)}>닫기</button>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button>Join A Room</button>
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
  width: 370px;
  height: 80%;
  min-height: 520px;
  max-height: 680px;
  overflow: hidden;
  border-radius: 30px;
  padding: 10px 20px;
  background-color: #eeeeee;
  box-shadow: rgb(0 0 0 / 30%) 0px 12px 60px 5px;
  animation: ${boxFade} 0.20s ease-out 0s 1 normal none running;
  z-index: 99;
  input {
    width: 100%;
    height: 20px;
    border: 1px solid #000;
  }
`

export default Chat;
