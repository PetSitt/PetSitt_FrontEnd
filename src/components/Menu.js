import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import jwt_decode from "jwt-decode"
import { Link, useLocation } from 'react-router-dom';

const Menu = ({popup, setPopup, socket}) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState();
  // useEffect(() => {
  // if(localStorage.getItem('accessToken') && socket){
  //     const {userEmail} = jwt_decode(localStorage.getItem('accessToken'));
  //     socket.emit("join_my_room", userEmail);
  //   }
  // },[socket])
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
  },[location.pathname])
  
  return (
    <MenuInner>
      <div className='item'>
        <Link className={`nav-link ${activeMenu === 'home' ? 'isActive' : ''}`} to='/'>
          <i className='ic-home' style={{fontSize: '25px', fontWeight: '500'}}></i>
        </Link>
      </div>
      <div className='item' onClick={() => setPopup((prev) => {
        return {
          ...prev,
          popup: !popup
        }
      })}>
        <button className='nav-link' type="button">
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
  );
};

const MenuInner = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
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
  @media (min-width: 768px) {
    max-width: 412px;
    right: 10%;
    left: auto;
  }
  .item {
    color: #787878;
    cursor: pointer;
    .nav-link{
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
    }
  }
  .active {
    color: #fc9215;
  }
`;
export default Menu;
