/* global kakao */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DaumPostcodeEmbed from "react-daum-postcode";

const SearchAddress = ({ setAddress }) => {
  const geocoder = new kakao.maps.services.Geocoder();


	const handleComplete = (data) => {
		let fullAddress = data.address;
		let extraAddress = "";
		if (data.addressType === "R") {
			if (data.bname !== "") {
				extraAddress += data.bname;
			}
			if (data.buildingName !== "") {
				extraAddress +=
					extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
			}
			fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
		}
		setAddress(fullAddress);

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(data.address, function(result, status) {
      console.log(result);
    });
    
	};

  const handleSearch = (data) => {
    console.log(data, data.q, 'data???????')
    setTimeout(()=>{console.log(document.getElementById('__daum__layer_1'))}, 3000)
  }

  
	const themeObj = {
		bgColor: "#FFFFFF", //바탕 배경색
		pageBgColor: "#FFFFFF", //페이지 배경색
		textColor: "#222222", //기본 글자색
		queryTextColor: "#222222", //검색창 글자색
		outlineColor: "#FFFFFF", //테두리
		outlinePadding: 0,
	};
	return (
		<div>
			<p
				style={{
					textAlign: "center",
					fontWeight: "700",
					lineHeight: "32px",
					fontSize: "15px",
				}}
			>
				장소 선택
			</p>
			<DaumPostcodeEmbed
				onComplete={handleComplete}
        onSearch={handleSearch}
				style={{ width: "100%", height: "200px" }}
				theme={themeObj}
				useBannerLink={false}
        submitMode={false}
			/>
		</div>
	);
};


export default SearchAddress;
