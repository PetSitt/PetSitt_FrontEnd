import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

const Modal = ({_display, _alert, _title, _text, _cancel, _confirm, confirmOnClick, cancelOnclick}) => {
  const [display, setDisplay] = useState(false);
  useEffect(()=>{
    setDisplay(_display)
  },[_display])
  return (
    <ModalContainer style={{display: display ? 'block' : 'none'}}>
      <div className="modal">
        <div className="text_area">
          {_title && <h3>{_title}</h3>}
          {_text && <p>{_text}</p>}
        </div>
        <div className={`button_area ${!_alert && 'button_x2'}`}>
          {!_alert && 
          <button type="button" className="cancel" onClick={cancelOnclick ? cancelOnclick : setDisplay(false)}>{_cancel ? _cancel : '취소'}</button>
          }
          <button type="button" className="confirm" onClick={confirmOnClick ? confirmOnClick : setDisplay(false)}>{_confirm ? _confirm : '확인'}</button>
        </div>
      </div>
    </ModalContainer>
  )
}


const ModalContainer = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,.4);
  z-index: 10;
  .modal{
    max-width: 95%;
    width: 500px;
    padding: 40px 20px;
    margin: 30px auto;
    background-color: #fff;
    text-align: center;
    line-height: 1.4;
    h3{
      font-size: 18px;
      font-weight: bold;
    }
    p{
      font-size: 14px;
      margin-top: 15px;
    }
    .button_area{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 20px 0 0;
      button{
        padding: 0 15px;
        line-height: 34px;
        border: 1px solid #333;
        &.confirm{
          background-color: #333;
          color: #fff;
        }
      }
      &.button_x2{
        button{
          flex-basis: 50%;
        }
      }
    }
  }

`
export default Modal;