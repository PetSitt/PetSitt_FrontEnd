import styled, {css} from "styled-components";

/* 
*	Props로 _id값을 받으면 값을 array형태로 추가 가능.
* Props로 _id값을 받지 않으면 Boolean형으로 구현.
*/
const Checkbox = ({_id, _text, _required, _size, _border, _bgColor ,checked, onChange}) => {
	const styles = {_size, _border, _bgColor}

	return (
		<StLabel htmlFor={_id}>
			<StInput {...styles} type="checkbox" id={_id} name={_text} required={_required} onChange={(e) => {
				_id ? onChange(e.currentTarget.checked, _id) : onChange(e.currentTarget.checked)
			}} checked={ _id ? checked.includes(_id) ? true : false : null}></StInput>
			<StP>{_text}</StP>
		</StLabel>
	);
}

Checkbox.defaultProps = {
	_size: "1.2rem",
	_border: "1.2px solid gainsboro",
	_bgColor: "#000"
}

const StLabel = styled.label`
  display: inline-block;
  align-items: center;
  user-select: none;
`;

const StInput = styled.input`
	${() => {
		return css`
				display: inline-block;
				vertical-align: middle;
				appearance: none;
				width: ${props => props._size};
				height: ${props => props._size};
				border: ${props => props._border};
				border-radius: 0.25rem;
				&:checked {
					border-color: transparent;
					background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
					background-size: cover;
					background-position: 50%;
					background-repeat: no-repeat;
					background-color: ${props => props._bgColor}
				}
				&[required] + p:after {
						content: "";
						display: inline-block;
						position: absolute;
						width: 6px;
						height: 6px;
						border-radius: 50%;
						background-color: rgb(255, 107, 107);
						top: 0px;
						right: -12px;
				}
		`
	}}
`;

const StP = styled.p`
	display: inline-block;
	font-size: 20px;
	vertical-align: middle;
  margin-left: 0.25rem;
	position: relative;
`;

export default Checkbox;