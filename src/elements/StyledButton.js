import styled from 'styled-components';

const StyledButton = ({
  _margin,
  _border,
  color,
  _bgColor,
  _onClick,
  _title,
  _width,
  _fontWeight,
  _padding,
}) => {
  const style = {
    _margin,
    _border,
    color,
    _bgColor,
    _width,
    _fontWeight,
    _padding,
  };
  return (
    <MainButton {...style} onClick={_onClick}>
      {_title}
    </MainButton>
  );
};

StyledButton.defaultProps = {
  _title: '버튼',
  _onClick: null,
  _border: 'none',
  color: '#ffffff',
  _bgColor: '#fc9215',
  _margin: '16px 0px',
  _padding: '14px 0px',
};

const MainButton = styled.button`
  width: ${(props) => (props._width ? props._width : '100%')};
  font-size: 16px;
  font-weight: ${(props) => (props._fontWeight ? props._fontWeight : '700')};
  padding: ${(props) => (props._padding ? props._padding : '14px 0px')};
  line-height: 19px;
  border-radius: 6px;
  color: ${(props) => props.color};
  margin: ${(props) => props._margin};
  border: ${(props) => props._border};
  background-color: ${(props) => props._bgColor};
`;

export default StyledButton;
