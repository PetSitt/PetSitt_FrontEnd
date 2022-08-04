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
  const [socketStore, setSocketStored] = useState();
  const newCheck = useRef(false);
  const chatBodyHeight = useRef();
  const [roomInfo, setRoomInfo] = useState({roomId: null, senderName: null,});
  const {data: getChatList, isFetching, isSuccess} = useQuery("chatList", () => chatApis.chatListGet(), {
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
      setRoomEnter(false);    
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
    <ChatWrap>
      <ChatBody>
        {
          !roomEnter ? (
            <ChatList listData={getChatList.data.rooms} setRoomEnter={setRoomEnter} setChatDisplay={setChatDisplay} setRoomInfo={setRoomInfo} isFetching={isFetching} isSuccess={isSuccess}/>
          ) : (
            <ChatRoom roomId={chatRoomOnly?.status ? chatRoomOnly?.roomId : roomInfo.roomId} setSocketStored={setSocketStored} setNewMessage={setNewMessage} setChatDisplay={setChatDisplay} setRoomEnter={setRoomEnter} senderName={chatRoomOnly?.status ? chatRoomOnly?.sender : roomInfo.senderName}/>
          )
        }
      </ChatBody>
    </ChatWrap>
  )
}

const ChatWrap = styled.div`
  position: fixed;
  left: auto;
  right: 10%;
  max-width: 412px;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 300;
  max-height: 100%;
  &::before{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    content: '';
    z-index: -1;
  }
  @media (max-width: 1024px){
	right: 0;
  }
  @media (max-width: 768px){
    left: 0;
    max-width: 100%;
  }
`
const ChatBody = styled.div`
  height: 100%;
  padding: 69px 0 0!important;
`

export default Chat;