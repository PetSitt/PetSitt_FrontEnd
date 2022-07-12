import styled from "styled-components";

const InputBox = ({
  _label,
  _type,
  _ref,
  _placeholder,
  _name,
  _onChange,
  _value,
}) => {
  return (
    <InputWrap>
      <label>{_label}</label>
      <input
        type={_type}
        {... _ref ? `ref=${_ref}` : null}
        {... _name ? `name=${_name}` : null}
        placeholder={_placeholder}
        onChange={_onChange}
        value={_value}
      />
    </InputWrap>
  );
};

InputBox.defaultProps = {
  _label: "라벨",
  _type: "text",
  _ref: "ref",
  _placeholder: "미리보기 내용",
  _alert: "알림 내용",
  _name: "이름",
  _onChange: () => {},
  _value: "",
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
