import React from "react";
import styled from "styled-components";
import Input from "../elements/Input";

const AddressInfo = ({_name, _address, _zonecode, onChange}) => {
	return(
		<ContensInner className={"contents"}>
			<div className="postNumber box">
				<Input _defaultValue={_zonecode} onChange={onChange} />
				<div className="postLink">우편번호</div>
			</div>
			<div className="box">
				<Input _defaultValue={_address} onChange={onChange} />
			</div>
			<div className="box">
				<Input _name={_name} onChange={onChange}>상세주소</Input>
			</div>
		</ContensInner>
	)
};

const ContensInner = styled.div`
	.postNumber {
		display: flex;
		justify-content: center;
		align-items: center;
		.inputBx {
			flex-shrink: 1;
		}
		.postLink {
			width: 95px;
			height: 44px;
			line-height: 44px;
			flex-grow: 0;
			color: #fff;
			background-color: #000;
			text-align: center;
			border-radius:0.4rem;
		}
	}
	
`

export default AddressInfo;