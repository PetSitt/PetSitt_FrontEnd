import styled from 'styled-components';

const InputBox = ({ children, outlined }) => {
  return <InputWrap>{children}</InputWrap>;
};

InputBox.defaultProps = {
  _label: '라벨',
};

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 24px;
  & label {
    font-size: 16px;
    line-height: 19px;
    padding-bottom: 7px;
  }
  & input {
    border-bottom: 1px solid rgba(120, 120, 120, 0.2);
    padding: 9px 0px;
    :focus {
      border-bottom: 1px solid #fc9215;
    }
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
