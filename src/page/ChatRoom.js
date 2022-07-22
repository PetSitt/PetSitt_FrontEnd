import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { useQuery } from "react-query";
import ScrollToBottom from "react-scroll-to-bottom";
import { chatApis } from "../store/chatApi";

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleTimeString('ko-KR');
};

function ChatRoom({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [roomJoin, setRoomJoin] = useState(false);

  const { isLoading: dataLoading, data: chatsRoom } = useQuery(["chatsRoom", room], () => chatApis.chatRoomGet(room), {
    staleTime: Infinity,
    refetchOnMount: 'always',
    enabled: !!roomJoin //디폴트 자동실행 false(채팅방 들어왔을때 true).
  });

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    setRoomJoin(true);
  }, [socket]);
  
  if(!chatsRoom) return null
  return (
    <ChatInner>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {chatsRoom.data.chats.map((el, idx) => {
            return (
              <div
								key={idx}
                className={`message ${el.me ? "me" : "other"}`}
              >
                <div className="message-content">
                  <p>{el.chatText}</p>
                </div>
                <div className="message-meta">
                  <p className="time">{formatDate(el.createdAt)}</p>
                  <p className="author">{el.author}</p>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="메세지를 입력해주세요."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </ChatInner>
  );
}

const ChatInner = styled.div`
  .chat-header {}
  .chat-body {
    .message-content {
      width: auto;
      height: auto;
      min-height: 40px;
      max-width: 120px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      margin-right: 5px;
      margin-left: 5px;
      padding-right: 5px;
      padding-left: 5px;
      overflow-wrap: break-word;
      word-break: break-word;
    }
    .message {
      display: flex;
      padding-bottom: 8px;
      position: relative;
      p {font-size: 14px}
      p.time {font-size: 10px}
    }
    .message.me {
      justify-content: end;
      flex-direction: row-reverse;
      align-items: flex-end;
      .message-content{
        padding: 10px;
        color: white;
        background-color: #fc9215;
        border-radius: 16px;
        max-width: 340px;
      }
    }
    .message.other {
      justify-content: flex-start;
      align-items: flex-end;
      .message-content{
        padding: 0 16px;
        max-width: 340px;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 16px;
      }
    }
  }
  .chat-footer {
    position: fixed;
    max-width: 412px;
    min-height: 45px;
    width: 346px;
    right: 11.6%;
    bottom: 4%;
    z-index: 99;
    border-radius: 18px;
    background-color: rgba( 255, 255, 255, 0.9 );
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    input {
      width: 100%;
      height: 45px;
      line-height: 45px;
    }
  }
`

export default ChatRoom;
