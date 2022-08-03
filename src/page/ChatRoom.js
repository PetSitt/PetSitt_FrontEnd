import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import styled from 'styled-components';
import { useQueryClient, useQuery } from "react-query";
import jwt_decode from "jwt-decode"
import { chatApis } from "../store/chatApi";
import LoadingBox from '../elements/Loading';


const convertDate = (time) => {
  const newTime = new Date(time);
  const [hour, minute, second] = newTime.toLocaleTimeString("ko-KR").split(/:| /);
  return `${hour} ${minute}:${second}`;
}
function ChatRoom({setSocketStored, setNewMessage, setChatDisplay, setRoomEnter, roomId, senderName}) {
  const queryClient = useQueryClient();
  const [historyGet, setHistoryGet] = useState();
  const [socket, setSocket] = useState();
  const newCheck = useRef(false);
  const isLoading = useRef(false);
  const textRef = useRef();
  const chatRoomRef = useRef();
  const [messageToSend, setMessageToSend] = useState();
  const dateDividers = useRef({index: [], dates: []});
  const isNewToday = useRef({status: false, lastIndex: null, date: null});
  const chatRoomGetApi = (roomId, socketId) => {
    return chatApis.chatRoomGet(roomId, socketId);
  }
  const [messages, setMessages] = useState();
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
      newCheck.current = false;
    },
    enabled: !!newCheck.current,
  })
  const {data: chatHistory, isFetched} = useQuery(['chatHistory', roomId, socket?.id], ()=>chatRoomGetApi(roomId, socket?.id), {
    onSuccess: (data) => {
      const array = data.data.chats;
      const today = new Date(Date.now()).toLocaleDateString("ko-KR");
      const [todayYear, todayMonth, todayDate] = today.split('. ');
      if(data.data.chats.length){
        let i = 1;
        // 채팅 날짜 구분을 추가하기 위한 코드
        array.reduce((acc,cur,idx)=>{
          acc = cur; 
          // 날짜 형태 변경을 위한 코드
          const next = array[idx+1] ? array[idx+1]['createdAt'] : null;
          const thisDate = new Date(acc?.createdAt).toLocaleDateString("ko-KR");
          const nextDate = new Date(next).toLocaleDateString("ko-KR");
          const [year, month, date] = nextDate.split('. ');
          const [firstYear, firstMonth, firstDate] = new Date(array[0]['createdAt']).toLocaleDateString("ko-KR").split('. ');
          // 최초 메세지 인덱스와 날짜 저장
          dateDividers.current['index'][0] = 0;
          dateDividers.current['dates'][0] = `${firstYear}년 ${firstMonth}월 ${firstDate.split('.')[0]}일`;
          // 최초 메세지 이후 날짜가 변경되는 시점 찾아서 저장
          if(thisDate < nextDate && next && acc){ 
            // 원본 데이터 배열에서 뽑아 쓸 수 있도록 날짜가 변경되는 메세지의 인덱스와 날짜 저장
            dateDividers.current['index'][i] = idx+1;
            dateDividers.current['dates'][i] = `${year}년 ${month}월 ${date.split('.')[0]}일`
            i++;
          }else{
            return false;
          }
        },null);
        // 마지막 메세지가 오늘보다 이전일 경우 sendMessage, receiveMessage 이벤트 발생할 때 오늘 날짜 추가하기 위해 isNewToday.current값 변경
        const lastDate = new Date(array[array?.length-1]['createdAt']).toLocaleDateString("ko-KR");
        if(lastDate < today) {
          isNewToday.current = {status: true, lastIndex: array.length, date: `${todayYear}년 ${todayMonth}월 ${todayDate.split('.')[0]}일`};
        }
      }else{
        // 최초 메세지일 경우 sendMessage, receiveMessage 이벤트 발생할 때 오늘 날짜 추가
        isNewToday.current = {status: true, lastIndex: 0, date: `${todayYear}년 ${todayMonth}월 ${todayDate.split('.')[0]}일`};
      }
      setMessages(data.data.chats);
      setHistoryGet(false);
    },    
    enabled: !!historyGet,
  })

  const sendMessage = async () => {
    if (messageToSend?.trim().length > 0) {
      const messageData = { //서버에 보낼 데이터
        roomId: roomId,
        message: messageToSend,
        userEmail: jwt_decode(localStorage.getItem('accessToken')).userEmail
      };
      await socket.emit('send_message', messageData);
      const today = Date.now();
      const newMessage = { //화면을 갱신하기위한 데이터 형식
        roomId: roomId,
        chatText: messageToSend,
        createdAt: today,
        time: convertDate(Date.now()),
        me: true,
        newMessage: true,
        userName: chatHistory.data.myName,
      }; 
      setMessages((prev)=>{
        const newData = [...prev, newMessage];
        return newData;
      })
      if(isNewToday.current.status === true){
        dateDividers.current['index'].push(isNewToday.current.lastIndex);
        dateDividers.current['dates'].push(isNewToday.current.date);
        isNewToday.current.status = {status: false, lastIndex: null, date: null};
      }
    }
    setMessageToSend('');
    textRef.current.focus();
  };
  useEffect(()=>{
    // 소켓 연결
    const socket = io.connect(process.env.REACT_APP_SERVER, {transports: ['websocket'], upgrade: false});
    isLoading.current = true; // setTimeout 작동하는 동안 로딩 표시를 위해 설정
    setTimeout(()=>{
      setSocket(socket);
      isLoading.current = false;
    }, 300);
    return ()=>{
      socket.disconnect();
      setSocket();
    }
  },[]);

  useEffect(()=>{
    if(socket?.id){
      // 지난 채팅내역 요청
      setHistoryGet(true);
      // chatRoomGet api 요청(채팅 히스토리 데이터 요청) 보낼 때 socket id 이상할 경우 방지하기 위해
      socket.emit('join_room', roomId);
      setSocketStored(socket); // 부모 컴포넌트에 넘겨주기 위해 props에 저장
      socket.on('receive_message', (data) => {
        setMessages((prev)=>{
          const newData = [...prev, {...data, time: convertDate(data.createdAt)}];  
          return newData;
        });
        if(isNewToday.current.status === true){
          dateDividers.current['index'].push(isNewToday.current.lastIndex);
          dateDividers.current['dates'].push(isNewToday.current.date);
          isNewToday.current.status = {status: false, lastIndex: null, date: null};
        }
      });
      // 채팅방 들어온 후 메뉴바에 NEW 표시 여부를 체크하기 위해 api요청
      newCheck.current = true;
    }
  },[socket]);

  useEffect(()=>{
    if(messages && newCheck.current){
      setMessages((prev)=>{
        return prev.map(v=>{
          const chatDate = new Date(v.createdAt);
          const [hour, minute, second] = chatDate.toLocaleTimeString("ko-KR").split(/:| /);
          return {...v, time: `${hour} ${minute}:${second}`};
        })
      })
      chatRoomRef.current.scrollTop = chatRoomRef.current.scrollHeight;
    }
  },[isFetched])

  useEffect(()=>{
    if(messages){
      chatRoomRef.current.scrollTop = chatRoomRef.current.scrollHeight;
    }
  },[messages])
  return (
    <>
      <ChatHeaderWrap>
        <button type='button' className='back' onClick={()=>{
          setRoomEnter(false);
        }}>
          <i className='ic-arw-left'></i>
        </button>
        <p>{senderName}</p>
        <button type='button' className='close' onClick={()=>{
          setChatDisplay(false);
        }}>닫기</button>
      </ChatHeaderWrap>
      <ChatRoomWrap ref={chatRoomRef}>
        {
          checkNewMessage.isFetching && !checkNewMessage.isFetching ? (
            <div className='loadingWrap'>
              <LoadingBox />
            </div>
          ) : messages ? (
            <ul>
                {
                  messages.map((msg, idx)=>{
                    return(
                     <React.Fragment key={idx}>
                      {
                        dateDividers.current.index.map((v,i)=>{
                          if(v === idx){
                            return (
                              <DateDivider key={`date${i}`} className='date'><p>{dateDividers.current.dates[i]}</p></DateDivider>
                            )
                          }else{
                            return null;
                          }
                        })
                      }
                       <ChatMessage className={msg.me ? 'receiver' : 'sender'}>
                        <p>{msg.chatText}</p>
                        <span>{msg.time}</span>
                      </ChatMessage>
                     </React.Fragment>
                    )
                  })
                }
              </ul>
          ) : (
            <div className='loadingWrap'>
              <LoadingBox />
            </div>
          )
        }
        
        <InputArea>
          <input type="text" ref={textRef} value={messageToSend} placeholder={'메시지를 입력하세요.'} onKeyPress={(e)=>{
            setMessageToSend(e.target.value)
            if(e.key === 'Enter'){
              sendMessage();
            }
          }}
            onInput={(e)=>setMessageToSend(e.target.value)}
            autoComplete="off"
          />
          <button type="button" onClick={sendMessage}
            disabled={!messageToSend || messageToSend?.trim().length <= 0 ? true : false}
            ><i className='ic-send'>전송</i></button>
        </InputArea>
      </ChatRoomWrap>
    </>
  )
}

const ChatRoomWrap = styled.div`
position: relative;
height: calc(100% - 48px);
overflow: hidden;
overflow-y: auto;
padding: 16px 20px 30px;
@media(min-width: 768px){
  -ms-overflow-style: none; /* IE and Edge scrollbar 숨기기*/
  scrollbar-width: none; /* Firefox scrollbar 숨기기*/
}
  ul{
    display: flex;
    flex-direction: column;
  }
  .loadingWrap{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
const DateDivider = styled.li` 
  text-align: center;
  padding: 20px 0;
  p{
    display: inline-block;
    background-color: rgba(120,120,120,.1); 
    line-height: 22px;
    padding: 0 10px;
    border-radius: 11px;
    font-size: 14px;
    color: #676767;
  }
`
const ChatMessage = styled.li`
display: flex;
align-items: flex-end;
gap: 5px;
  &.sender{
    align-self: flex-start;
  }
  &.receiver{
    flex-direction: row-reverse;
    align-self: flex-end;
    p{
      background: rgba(252, 146, 21, 0.15);
    }
  }
  & + li{
    margin-top: 18px;
  }
  p{
    max-width: 75%;
    padding: 10px 16px;
    border-radius: 22px;
    line-height: 1.3;
    background-color: rgba(120,120,120,.1);
    word-break: break-word;
    color: #1a1a1a;
  }
  span{
    font-size: 12px;
    color: rgba(120,120,120,.7);
    margin-bottom: 4px;

  }
`
const InputArea = styled.div`
position: fixed;
display: flex;
width: 100%;
left: 0;
right: 0;
bottom: 0;
background-color: #F1F1F1;
padding: 5px 50px 5px 16px;
@media (min-width: 768px){
	max-width: 412px;
	right: 10%;
	left: auto;
}
  input{
    height: 38px;
    line-height: 38px;
    border-radius: 19px;
    background-color: #fff;
    width: 100%;
    font-size: 16px;
    padding: 0 15px;
    &::placeholder{
      color: rgba(120,120,120,.4);
    }
  }
  button{
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    padding: 5px;
    i{
      display: block;
      font-size: 0;
      &::before{
        font-size: 20px;
        color: rgba(120,120,120,.7);
      }
    }
    &:disabled{
      i{
        &::before{
          color: rgba(120,120,120,.3);
        }
      }
    }
  }
`
const ChatHeaderWrap = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
position: absolute;
left: 0;
right: 0;
top: 0;
width: 100%;
padding: 20px;
background-color: #fff;
border-bottom: 1px solid #E4E4E4;
box-sizing: border-box;
height: 70px;
	p{
		font-weight: 500;
    font-size: 21px;
    line-height: 29px;
    margin-left: -6px;
	}
	.close{
		width: 24px;
		height: 24px;
		font-size: 0;
    margin-top: -1px;
		&::before,
		&::after{
			position: absolute;
			left: 0;
			right: 0;
			top: 50%;
			width: 24px;
			height: 2px;
			background-color: #000;
			margin: -1px auto 0;
			content: '';
			transform: rotate(-45deg);
		}
		&::after{
			transform: rotate(45deg);
		}
	}
  button{
    position: relative;
    img, i{
      display: block;
      &.ic-arw-left{
        font-size: 34px;
        margin-left: -8px;
      }
    }
  }
`
export default ChatRoom;
