import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../elements/Modal';

const Menu = ({chatDisplay, setChatDisplay, newMessage}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState();
  const [modalDisplay, setModalDisplay] = useState(false);
  const activateMenu = () => {
    if(location.pathname === '/'){
      setActiveMenu('home')
    }else if(location.pathname.indexOf('reservation') > -1){
      setActiveMenu('reservation')
    }else if(location.pathname.indexOf('mypage') > -1){
      setActiveMenu('mypage')
    }
  }
  useEffect(()=>{
    activateMenu();
  },[location.pathname]);
  const [modalActive, setModalActive] = useState(false);
  useEffect(()=>{
    if(modalDisplay){
      setModalActive(true);
    }
  },[modalDisplay])
  
  return (
    <>
      <MenuInner>
        <div className='item'>
          <Link className={`nav-link ${activeMenu === 'home' ? 'isActive' : ''}`} to='/'>
            <i className='ic-home' style={{fontSize: '25px', fontWeight: '500'}}></i>
          </Link>
        </div>
        <div className='item' onClick={() => {
          if(localStorage.getItem('accessToken')){
            setChatDisplay(true);
          }else{
            setModalDisplay(true);
          }
        }}>
          <button className={`nav-link ${newMessage?.status ? 'hasNew' : ''}`} type="button">
            <i className='ic-chat' style={{fontSize: '21px'}}></i>
          </button>
        </div>
        <div className='item'>
              <Link className={`nav-link ${activeMenu === 'reservation' ? 'isActive' : ''}`} to='/reservation/list'>
            <i className='ic-schedule'></i>
          </Link>
        </div>
        <div className='item'>
          <Link className={`nav-link ${activeMenu === 'mypage' ? 'isActive' : ''}`} to='/mypage'>
            <i className='ic-profile' style={{fontSize: '24px', fontWeight: '500'}}></i>
          </Link>
        </div>
      </MenuInner>
      <Modal _alert={false} _display={modalDisplay} _confirm='로그인 하기' _cancel='취소'
      confirmOnClick={() => {
        if(window.location.pathname === '/login'){
          setModalDisplay(false);
        }else{
          window.location.href = '/login';
        }
      }}
      cancelOnclick={() => {
        setModalDisplay(false);
      }}>
        <div className='text_area'>
          <p>실시간 채팅 기능은</p>
          <p>로그인 후 이용 가능합니다.</p>
        </div>
      </Modal>
    </>
  );
};

const MenuInner = styled.nav`
  position: fixed;
  bottom: 0;
  left: auto;
  right: 10%;
  max-width: 412px;
  width: 100%;
  height: 54px;
  line-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid rgba(120, 120, 120, 0.2);
  margin-top: 100px;
  background-color: #fff;
  z-index: 2;
  @media (max-width: 1024px){
	right: 0;
  }
  @media (max-width: 768px){
    left: 0;
    max-width: 100%;
  }
  .item {
    color: #787878;
    cursor: pointer;
    .nav-link{
      position: relative;
      display: block;
      font-size: 22px;
      padding: 0 15px;
      i{
        display: block;
        color: rgba(120,120,120,.7);
      }
      &.isActive{
        i{
          color: #fc9215;
        }
      }
      &.hasNew{
        position: relative;
        &::before{
          position: absolute;
          right: 6px;
          top: -4px;
          width: 16px;
          height: 16px;
          font-size: 8px;
          color: #fff;
          font-weight: 700;
          line-height: 16px;
          border-radius: 50%;
          background-color: #fc9215;
          content: 'N';
          text-align: center;
        }
      }
    }
  }
  .active {
    color: #fc9215;
  }
`;
export default Menu;
