import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Menu = ({popup, setPopup}) => {
  return (
    <MenuInner>
      <div className='item'>
        <Link className='nav-link' to='/home'>
          <i className='ic-home'></i>
        </Link>
      </div>
      <div className='item' onClick={() => setPopup(!popup)}>
        <i className='ic-contact'></i>
      </div>
      <div className='item'>
        <Link className='nav-link' to='/reservation/list'>
          <i className='ic-book'></i>
        </Link>
      </div>
      <div className='item'>
        <Link className='nav-link' to='/mypage'>
          <i className='ic-user'></i>
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
  @media (min-width: 768px) {
    max-width: 412px;
    right: 10%;
    left: auto;
  }
  .item {
    font-size: 22px;
    color: #787878;
    cursor: pointer;
  }
  .active {
    color: #fc9215;
  }
`;
export default Menu;
