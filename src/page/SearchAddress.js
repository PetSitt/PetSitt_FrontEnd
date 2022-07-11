/* global kakao */
import React from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import axios from 'axios';

const SearchAddress = ({ setAddressInfo }) => {
  const handleSearch = (data) => {
    const searchTxt = data.q;
    var config = { headers: {Authorization : 'KakaoAK b80edb4c633e56678385535a84dd1d63'}}; //인증키 정보
    var url = 'https://dapi.kakao.com/v2/local/search/address.json?query='+searchTxt; // url 및 키워드 담아 보냄
    axios.get(url, config).then(function(result) { // API호출
      if(result.data != undefined || result.data != null){
				setAddressInfo(result.data.documents[0].address)
      }
    })
  }

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
				// onComplete={handleComplete}
        onSearch={handleSearch}
				style={{ width: "100%", height: "200px" }}
				useBannerLink={false}
        submitMode={false}
			/>
		</div>
	);
};


export default SearchAddress;
