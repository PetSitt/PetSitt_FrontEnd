import React, { useEffect } from "react";

const KakaoMapContainer = ({ address, onChange }) => {
  const { kakao } = window;
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    new kakao.maps.Map(container, options);
    //위도, 경도로 변환 및 마커표시
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        onChange("x", result[0].x);
        onChange("y", result[0].y);
      }
    });
  }, [address, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.services.Geocoder, kakao.maps.services.Status.OK]);

  return (
    <div
      id="map"
      // style={{ //스타일을 적용하면 지도가 화면에 노출됩니다.
      //   width: "100%",
      //   height: "300px",
      // }}
    ></div>
  );
};

export default KakaoMapContainer;
