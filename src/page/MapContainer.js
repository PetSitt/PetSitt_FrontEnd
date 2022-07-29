/*global kakao*/
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import {
  Map,
  MapMarker,
  CustomOverlayMap,
  MarkerClusterer,
  ZoomControl,
  Circle,
} from "react-kakao-maps-sdk";

import marker from '../assets/img/marker.png';
import star from '../assets/img/icon_star.png';
import { dblClick } from "@testing-library/user-event/dist/click";

const MapContainer = ({ centerElement, showOnly, items, _height, setSitterCardShow }) => {
  const [level, setLevel] = useState(3);
  const [centerElem, setCenterElem] = useState(centerElement && centerElement);
  const [positions, setPositions] = useState([]);
  const [sitters, setSitters] = useState([]);
  const mapRef = useRef();

  const onClusterclick = (_target, cluster) => {
    const map = mapRef.current;
    // 현재 지도 레벨에서 1레벨 확대한 레벨
    const level = map.getLevel() - 1;
    // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대
    map.setLevel(level, { anchor: cluster.getCenter() });
  };

  const markerClickEvent = (markerIndex, sitterIndex) => {
    setSitterCardShow({
      display: true,
      index: sitterIndex
    });
    const newCenter = {x: items[markerIndex].x, y: items[markerIndex].y + .0004}
    setCenterElem(newCenter);
    setLevel(3);
  };

  useEffect(()=>{
    items && setPositions(items);
  },[items])
  useEffect(() => {
    if (positions.length > 0) {
      setCenterElem(positions[0]);
    }
  }, [positions]);
  const bounds = new kakao.maps.LatLngBounds();


  if (!centerElem) return <p>로딩중입니다</p>;
  else
    return (
      <>
        <Map
          ref={mapRef}
          center={{ lat: centerElem.y, lng: centerElem.x }}
          style={{ width: "100%", height: _height ? _height :  "360px" }}
          onZoomChanged={(map) => setLevel(map.getLevel())}
          draggable={showOnly ? false : true}
          level={level}
          disableDoubleClickZoom={true}
        >
          {showOnly ? (
            <Circle
              center={{
                lat: centerElem.y,
                lng: centerElem.x,
              }}
              radius={50}
              strokeWeight={2} // 선의 두께
              strokeColor={"#FC9215"} // 선의 색
              strokeOpacity={1} // 선의 불투명도, 1에서 0 사이의 값
              strokeStyle={"normal"} // 선의 스타일
              fillColor={"#FC9215"} // 채우기 색
              fillOpacity={0.4} // 채우기 불투명도
            />
          ) : (
            <>
              <ZoomControl />
              <MarkerClusterer
                averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
                minLevel={6} // 클러스터 할 최소 지도 레벨
                level={3}
                disableClickZoom={true}
                onClusterclick={onClusterclick}
              >
                {positions.map((pos, idx) => (
                  <CustomOverlayMap
                    key={`pos_${idx}`}
                    position={{
                      lat: pos.y,
                      lng: pos.x,
                    }}
                    image={{
                      src: marker,
                      size: {
                        width: 40,
                        height: 47,
                      }, // 마커이미지의 크기입니다
                      options: {
                        offset: {
                          x: 20,
                          y: -47,
                        }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                      },
                      style: {textAlign: 'center', display: 'flex', justifyContent: 'center'}
                    }}
                  >
                    <div style={{textAlign: 'center', transform: 'translate(0, -47px)'}}>
                      <div style={{display: 'flex', alignItems: 'center', height: '40px', padding: '0 15px', background: '#fff', borderRadius: '20px', border: '1px solid #FC9215', boxSizing: 'border-box'}} onClick={()=>markerClickEvent(idx, pos.index)}>
                        <strong style={{fontWeight: 700}}>{pos.sitterName}</strong>
                        <span style={{fontSize: '14px'}}><img src={star} alt="star" style={{display: 'inline-block', width: '13px', height: '13px', verticalAlign: 'middle', margin: '-3px 1px 0 5px'}}/>{pos.averageStar}</span>
                      </div>
                      <img src={marker} alt="star" style={{width: '40px', height: '47px', margin: '2px 0 0'}}/>
                    </div>
                  </CustomOverlayMap>
                ))}
              </MarkerClusterer>
            </>
          )}
        </Map>
      </>
    );
};

export default MapContainer;
