import { useEffect, useRef } from "react";
import styled from "styled-components";
import LoadingBox from '../elements/Loading';

function ChatList({listData, setRoomEnter, roomId, setChatDisplay}) {
  const ChatItems = useRef();
  const newDates = useRef();
  const sortData = () => {
    listData.sort(function compare(a, b) {
      if(a.lastChatAt > b.lastChatAt) return -1;
      if(a.lastChatAt < b.lastChatAt) return 1;
      return 0;
    })
    return listData;
  }
  const convertDate = () => {
    const today = new Date(Date.now());
    const date = listData.map(v=>{
      const chatDate = new Date(v.lastChatAt);
      if(chatDate.toDateString() === today.toDateString()){
        const [hour, minute, second] = chatDate.toLocaleTimeString("ko-KR").split(/:| /);
        return `${hour} ${minute}:${second}`;
      }else{
        return chatDate.toLocaleDateString("ko-KR");
      }
    })
    return date;
  }
  useEffect(()=>{
    ChatItems.current = sortData();
    newDates.current = convertDate();
  },[listData])

  useEffect(()=>{
    return()=>{
      ChatItems.current = null;
    }
  },[])
  
  if(!listData) return (
    <>
      <ChatHeaderWrap>
        <p>채팅</p>
        <button type='button' onClick={()=>{
          setChatDisplay(false);
        }}>닫기</button>
      </ChatHeaderWrap>
      <ChatBodyWrap>
        <div className='loadingWrap'>
          <LoadingBox />
        </div>
      </ChatBodyWrap>
    </>
  )
  return (
    <>
      <ChatHeaderWrap>
        <p>채팅</p>
        <button type='button' onClick={()=>{
          setChatDisplay(false);
        }}>닫기</button>
      </ChatHeaderWrap>
      <ChatBodyWrap>
      {(ChatItems.current && newDates.current) ? (
        <ul>
          {
            ChatItems.current.map((list,idx)=>{
              return (
                <ChatListItem key={idx} onClick={()=>{setRoomEnter(true); roomId.current = list.roomId}}>
                  <UserImage style={{backgroundImage: `url(${list.imageUrl})`}}></UserImage>
                  <ChatListInfo>
                    <p className='info'>
                      <span className='userName'>{list.userName}</span>
                      <span className='date'>{newDates.current[idx]}</span>
                    </p>
                    <p className='message'>{list.lastChat}</p>
                  </ChatListInfo>
                  {
                    list.newMessage && <i className='ic-new'>NEW</i>
                  }
                </ChatListItem>
              )
            })
          }
        </ul>
      ) : (
        <div className='loadingWrap'>
          <LoadingBox />
        </div>
      )}
      </ChatBodyWrap>
    </>
  );
};

const ChatBodyWrap = styled.div`
  height: 100%;
  padding: 24px 20px;
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  @media(min-width: 768px){
    -ms-overflow-style: none; /* IE and Edge scrollbar 숨기기*/
    scrollbar-width: none; /* Firefox scrollbar 숨기기*/
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
const UserImage = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  border: 1px solid #e9e9e9;
`
const ChatListItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  .ic-new{
    position: absolute;
    right: 0;
    top: 50%;
    height: 20px;
    line-height: 18px;
    border-radius: 10px;
    padding: 0 5px;
    color: #fff;
    background-color: #fc9215;
    font-weight: 700;
    font-size: 12px;
    margin-top: -10px;
  }
  & + li{
    margin-top: 16px;
  }
`
const ChatListInfo = styled.div`
  display: flex;
  width: 100%;
  max-width: calc(100% - 56px);
  flex-direction: column;
  cursor: pointer;
  font-size: 14px;
  gap: 5px;
  padding-right: 50px;
  .info{
    display: flex;
    gap: 10px;
    .date{
      color: #676767;
    }
  }
  .message{
    line-height: 1.4;
    min-height: 1.4em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

`
const ChatHeaderWrap = styled.div`
position: fixed;
left: 0;
right: 0;
top: 0;
width: 100%;
padding: 20px;
background-color: #fff;
border-bottom: 1px solid #fff;
box-sizing: border-box;
height: 70px;
@media (min-width: 768px){
	max-width: 412px;
	right: 10%;
	left: auto;
}
	p{
		font-weight: 700;
    font-size: 24px;
    line-height: 29px;
	}
	button{
		position: absolute;
		right: 20px;
		top: 22px;
		width: 24px;
		height: 24px;
		font-size: 0;
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
`
const Message = styled.p`
  font-size: 16px;
  line-height: 1.4;
`
export default ChatList;
