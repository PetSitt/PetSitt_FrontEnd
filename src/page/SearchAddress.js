/* global kakao */
import React from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import axios from 'axios';

const SearchAddress = ({ setAddressInfo, setIframeDisplay }) => {
  	const handleSearch = (data) => {
		const kakaoMapApi = axios.create();
		kakaoMapApi.defaults.withCredentials = false;
		kakaoMapApi.defaults.headers.common['Authorization'] = `KakaoAK ${process.env.REACT_APP_KAKAO_RESTAPI}`;
		kakaoMapApi.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		const searchTxt = data.q;
    const url = 'https://dapi.kakao.com/v2/local/search/address.json?query='+searchTxt; // url 및 키워드 담아 보냄
		kakaoMapApi.get(url).then(function(result) { // API호출
      if(result.data != undefined || result.data != null){
				console.log(result.data)
				if(result.data.documents[0].address) {
					setAddressInfo(result.data.documents[0].address); setIframeDisplay(false);
				} else {
					const x = result.data.documents[0].x;
					const y = result.data.documents[0].y;
					const url_2nd ='https://dapi.kakao.com/v2/local/geo/coord2address.json?x='+x+'&y='+y;
					kakaoMapApi.get(url_2nd).then(function(result2) { // API호출
						if(result2.data != undefined || result2.data != null){
							const searchTxt_3nd = result2.data.documents[0].address.address_name;
							const url_3rd = 'https://dapi.kakao.com/v2/local/search/address.json?query='+searchTxt_3nd; // url 및 키워드 담아 보냄
							kakaoMapApi.get(url_3rd).then(function(result3) { // API호출
								if(result3.data != undefined || result3.data != null){
									setAddressInfo(result3.data.documents[0].address);
									setIframeDisplay(false);
								}
							})
						}
					})
				}
      }
    })
		.catch(function (error) {
			console.log(error.response.headers);
		})
		.finally(function () {
			console.log("finally ");
		});
  }

	return (
		<DaumPostcodeEmbed
			// onComplete={handleComplete}
			onSearch={handleSearch}
			style={{ width: "100%"}}
			useBannerLink={false}
			submitMode={false}
			className='daum-postcode-wrap'
		/>
	);
};


export default SearchAddress;
