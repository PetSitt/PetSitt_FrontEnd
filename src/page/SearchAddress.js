/* global kakao */
import React from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import axios from 'axios';

const SearchAddress = ({ setAddressInfo, setIframeDisplay }) => {
	const handleClose = (data) => {
		if(data === 'COMPLETE_CLOSE'){
			setIframeDisplay(false);
		}
	}
	const handleComplete = (data) => {
	const searchTxt = data.address;
	const config = { headers: {Authorization : `KakaoAK ${process.env.REACT_APP_KAKAO_RESTAPI}`}}; //인증키 정보
	const url = 'https://dapi.kakao.com/v2/local/search/address.json?query='+searchTxt; // url 및 키워드 담아 보냄
	axios.get(url, config).then(function(result) { // API호출
		if(result.data !== undefined || result.data !== null){
			if(result.data.documents[0].x && result.data.documents[0].y) {
				setAddressInfo({
					address_name: result.data.documents[0].address.address_name,
					region_2depth_name: result.data.documents[0].address.region_2depth_name,
					x: result.data.documents[0].x,
					y: result.data.documents[0].y,
				})
			}
			}
		})
	}
	return (
		<DaumPostcodeEmbed
			onComplete={handleComplete}
			onClose={handleClose}
			style={{ width: "100%"}}
			useBannerLink={false}
			submitMode={false}
			className='daum-postcode-wrap'
		/>
	);
};


export default SearchAddress;
