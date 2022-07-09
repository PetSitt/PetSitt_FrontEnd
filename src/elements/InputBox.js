import styled from 'styled-components';

const InputBox = ({ _label, _type, _ref, _placeholder, _alert }) => {
  return (
    <InputWrap>
      <label>{_label}</label>
      <input type={_type} ref={_ref} placeholder={_placeholder} />
      <span>{_alert}</span>
    </InputWrap>
  );
};

InputBox.defaultProps = {
  _label: '',
  _type: 'text',
  _ref: '',
  _placeholder: '미리보기 내용',
  _alert: '알림 내용',
};

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  & label {
    font-size: 16px;
    line-height: 19px;
    padding-bottom: 7px;
  }
  & input {
    border-bottom: 1px solid rgba(120, 120, 120, 0.2);
    padding: 9px 0px;
    ::placeholder {
      color: rgba(120, 120, 120, 0.6);
      font-size: 16px;
      line-height: 19px;
      font-weight: 400;
    }
    :focus::placeholder {
      color: transparent;
    }
  }
`;

export default InputBox;
