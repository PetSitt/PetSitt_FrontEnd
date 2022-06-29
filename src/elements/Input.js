import styled, { css } from "styled-components";

const Input = ({_width, _height, _color, _fontSize, _lineHeight, _padding, _border, _borderRadius ,_placeholder, _required, children}) => {
	const styles = { _width, _height, _color, _fontSize, _lineHeight, _padding, _border, _borderRadius };

	return (
		<InputBx {...styles}>
			<label htmlFor="name">{children}</label>
			<input type="text" id="name" name="name" placeholder={_placeholder} required={_required} />
		</InputBx>
	);
};

Input.defaultProps = {
	_width: "100%",
  _height: "56px",
	_fontSize: "1.2rem",
  _padding: "0 20px",
  _color: "#b1b1b3",
  _border: "2px solid #8f8f9c",
	_borderRadius: "14px"
}

const InputBx = styled.div`
	${({theme}) => {
		const { fontWeight, colors } = theme;
		return css `
			width: ${props => props._width};
			height: ${props => props._height};
			line-height: ${props => props._height};
			input {
				width: 100%;
				height: 100%;
				font-size: ${props => props._fontSize};
				font-weight: ${fontWeight.regular};
				border: ${props => props._border};
				border-radius: ${props => props._borderRadius};
				padding: ${props => props._padding};
				box-sizing: border-box;
				transition: border 0.4s ease-in-out;
			}
			input::placeholder {
				color: ${props => props._color};
			}
			input:focus {
				border: 2px solid ${colors.black};
			}
		`
	}};
`


export default Input;