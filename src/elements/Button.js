import styled, {css} from "styled-components";

const Button = ({_width, _height, _color, _bgColor, _borderRadius, _fontSize, _lineHeight, _padding, children, onClick}) => {
	const styles = {_width, _height, _color, _bgColor, _borderRadius, _fontSize, _lineHeight, _padding, children};

	return (
		<BtnBx {...styles} className="btnBx" onClick={onClick}>{children}</BtnBx>
	);
}

Button.defaultProps = {
	_width: "63px",
	_height: "33px",
	_color : "#fff",
	_bgColor : "#000",
	_borderRadius: "0.4rem"
}

const BtnBx = styled.button`
	${({theme}) => {
		const {fontWeight} = theme;
		return css `
			width: ${props => props._width};
			height: ${props => props._height};
			font-size: ${props => props._fontSize};
			font-weight: ${fontWeight.regular};
			color: ${props => props._color};
			background-color: ${props => props._bgColor};
			border-radius: ${props => props._borderRadius};
		`
	}}
`

export default Button;