import React, { useEffect, useState } from "react";
import styled from "styled-components";
import StyledButton from "./StyledButton";

const Modal = ({
  _display,
  _alert,
  children,
  _cancel,
  _confirm,
  confirmOnClick,
  cancelOnclick,
}) => {
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    setDisplay(_display);
  }, [_display]);
  return (
    <ModalContainer style={{ display: display ? "block" : "none" }}>
      <div className="modal">
        {children}
        <div className={`button_area ${!_alert && "button_x2"}`}>
          {!_alert && (
            <button
              type="button"
              className="cancel"
              onClick={cancelOnclick ? cancelOnclick : setDisplay(false)}
            >
              {_cancel ? _cancel : "취소"}
            </button>
          )}
          <StyledButton
            _title={_confirm ? _confirm : "확인"}
            _margin={"24px 0 0 0"}
            _onClick={confirmOnClick ? confirmOnClick : setDisplay(false)}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
  .modal {
    max-width: 95%;
    width: 100%;
    padding: 24px;
    margin: 299px auto;
    background-color: #fff;
    text-align: center;
    line-height: 1.4;
    border-radius: 6px;
    h3 {
      font-weight: 400;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      & span {
        color: #fc9215;
      }
    }
  }
  @media (min-width:768px) {
    position: absolute;
    top: 0%;
    overflow: auto;
  }
`;
export default Modal;
