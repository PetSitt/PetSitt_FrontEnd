import styled, { css } from "styled-components";

const Input = ({_width, _height, _color, _fontSize, _lineHeight, _padding, _border, _placeholder, _required, children}) => {
	const styles = { _width, _height, _color, _fontSize, _lineHeight, _padding, _border };
	
	return (
		<InputBx {...styles}>
			<label htmlFor="name">{children}</label>
			<input type="text" id="name" name="name" placeholder={_placeholder} required={_required} />
		</InputBx>
	);
};

Input.defaultProps = {
	_width: "100%",
  _height: "28px",
	_fontSize: "16px",
  _padding: "10px",
  _color: "#353C49",
  _border: "1px solid #000"
}

const InputBx = styled.div`
	${({theme}) => {
		const { fontWeight } = theme;
		return css `	
			input {
				width: ${props => props._width};
				height: ${props => props._height};
				font-size: ${props => props._fontSize};
				font-weight: ${fontWeight.regular};
				padding: ${props => props._padding};
				box-sizing: border-box;
				line-height: ${props => props._height};
				border: ${props => props._border};
			}
			input::placeholder {
				color: ${props => props._color};
			}
		`
	}};
`


export default Input;