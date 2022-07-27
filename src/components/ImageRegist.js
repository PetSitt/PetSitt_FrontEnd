import React, { useState } from "react";
import styled from "styled-components";
import { handleChange } from "../shared/common";

const ImageRegist = ({name, value, onChange, setValues}) => {
	const [showImages, setShowImages] = useState(value ? [value] : []);
	const [num, setNum] = useState(0);

	// 이미지 추가
	const handleAddImages = (e) => {
		onChange(e);
		const imageLists = e.target.files;
		const currentImageUrl = URL.createObjectURL(imageLists[0]);

		if(showImages.length >= 1) {
			alert("한장이상 등록할수 없습니다.");
		  return
		} else {
			setShowImages((preve) => {
				return [...preve, currentImageUrl]
			});
		}
	};

	// X버튼 클릭 시 이미지 삭제
  const handleDeleteImage = (id) =>{
		const nextItems = showImages.filter((_, index) => index !== id);
		setShowImages(nextItems);
		setNum(num - 1);
		setValues((prev) => {
			return {
				...prev,
				[name]: ""
			}
		});
	};

	return(
		<ImageRegistBx>
			<input type="file" id={name} accept="image/png, image/jpeg" name={name} onChange={handleAddImages}/>
			<label htmlFor={name}>
				<div className="file-add-inner">
					<i className="ic-plus"></i>
					<p className="num num-start">{showImages.length}<span className="num num-end">/1</span></p>
				</div>
			</label> 
			{showImages && showImages.map((image, idx) => (
				<ShowImageInner key={idx}>
					<div className="deleteBtn" onClick={() => handleDeleteImage(idx)}><i className="ic-close close"></i></div>
					<span className="bgImg" style={{backgroundImage: `url(${image})`}}></span>
				</ShowImageInner>
			))}
		</ImageRegistBx>
	)
};

const ImageRegistBx = styled.div`
		white-space: nowrap;
    overflow-x: auto;
		overflow-y: hidden;
		& label {
			width: 80px;
			display: inline-block;
			border: 1px dashed #C4C4C4;
			color: #C4C4C4;
			font-size: 22px;
			font-weight: 600;
			border-radius: 0.6em;
			vertical-align: middle;
			cursor: pointer;
			text-align: center;
			.file-add-inner {
				position: relative;
				height: 80px;
				& i {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -100%);
				}
				p {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, 20%);
				}
			}
			
			.num {
				font-size: 14px;
				line-height: 1;
			}
		} 
		& input[type="file"] {
			display: none;
		}
`

const ShowImageInner = styled.span`
	width: 80px;
	height: 80px;
	display: inline-block;
	position: relative;
	text-align: center;
	margin-left: 10px;
	vertical-align: middle;
	& .close{
		font-size: 14px;
	}
	& > div {
		position: relative;
		margin: 0 0 0 10px;
	}
	& .bgImg {
		width: 80px;
		height: 80px;
		display: inline-block;
		background-size: cover;
    background-position: center;
    overflow: hidden;
    border-radius: 0.4em;
	}
	& .deleteBtn {
		width: 24px;
		height: 24px;
		line-height: 25px;
		cursor: pointer;
		background-color: #fff;
		box-shadow: rgb(0 0 0 / 8%) 0px 0px 8px;
		border-radius: 50%;
		position: absolute;
		top: 5px;
		right: 5px;
	}
	& img {
		width: 100%;
		border-radius: 0.3em;
	}
`

export default ImageRegist;