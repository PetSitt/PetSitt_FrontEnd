import { useEffect, useState } from "react";
import io from "socket.io-client";
import styled, {keyframes} from "styled-components";
import { chatApis } from "../store/chatApi";
import ChatRoom from "../components/ChatRoom";

const socket = io.connect("http://3.39.230.232");

function Chat({popup, setPopup}) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  useEffect(() => {
    console.log(chatApis.chatListGet())
    
  },[])

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
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <ChatRoom socket={socket} username={username} room={room} />
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
