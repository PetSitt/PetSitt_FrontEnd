import React,{useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { useQueryClient, useQuery } from "react-query";
import ChatHeader from '../components/ChatHeader';
import ChatList from '../page/ChatList';
import ChatRoom from '../page/ChatRoom';
import { chatApis } from "../store/chatApi";

const Chat = ({setChatDisplay, newMessage, setNewMessage, chatRoomOnly}) => {
  const queryClient = useQueryClient();
  const [dataLoad, setDataLoad] = useState(false);
  const [roomEnter, setRoomEnter] = useState(false);
  const roomId = useRef();
  const [socketStore, setSocketStored] = useState();
  const newCheck = useRef(false);
  const chatBodyHeight = useRef();
  const {data: getChatList} = useQuery("chatList", () => chatApis.chatListGet(), {
    onSuccess: (data)=>{
      setDataLoad(false);
    },
    enabled: !!dataLoad,
    staleTime: Infinity,
  });
  const checkNewMessage = useQuery('newMessage', ()=>chatApis.checkNewMessage(), {
    onSuccess: (data) => {
      if(data.data.check){
        setNewMessage((prev)=>{
          const newData = {...prev, status: true};
          return newData;
        });
      }else{
        setNewMessage((prev)=>{
          const newData = {...prev, status: false};
          return newData;
        });
      };
    },
    enabled: !!newCheck.current,
  })
  useEffect(()=>{
    //로그인 했을 경우에만 리스트 불러오기 요청
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) setDataLoad(true);
    chatBodyHeight.current = window.innerHeight;
    return()=>{
      queryClient.invalidateQueries('chatList');
      // setNewMessage({lastText: false, status: false});
    }
  },[]);
  useEffect(()=>{
    queryClient.invalidateQueries('chatList');
  },[getChatList]);

  useEffect(()=>{
    setDataLoad(true);
    newCheck.current = true;
  },[roomEnter,newMessage]);

  useEffect(()=>{
    if(chatRoomOnly.status) setRoomEnter(true);
  },[chatRoomOnly]);


  if(!getChatList) return null;
  return (
    <ChatWrap style={{height: chatBodyHeight.current + 'px'}}>
      <ChatBody>
        {
          !roomEnter ? (
            <ChatList listData={getChatList.data.rooms} setRoomEnter={setRoomEnter} roomId={roomId} setChatDisplay={setChatDisplay}/>
          ) : (
            <ChatRoom roomId={chatRoomOnly?.status ? chatRoomOnly?.roomId : roomId.current} setSocketStored={setSocketStored} setNewMessage={setNewMessage} setChatDisplay={setChatDisplay} setRoomEnter={setRoomEnter}/>
          )
        }
      </ChatBody>
    </ChatWrap>
  )
}

const ChatWrap = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  border: 1px solid #ddd;
  background-color: #fff;
  z-index: 300;
  &::before{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    content: '';
    z-index: -1;
  }
  @media (min-width: 768px){
    max-width: 412px;
    right: 10%;
    left: auto;
  }
`
const ChatBody = styled.div`
  height: 100%;
  padding: 69px 0 0!important;
`

export default Chat;