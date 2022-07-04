import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import {
	Map,
	MapMarker,
	MarkerClusterer,
	ZoomControl,
} from "react-kakao-maps-sdk";

const MapIndex = () => {
	const [level, setLevel] = useState();
	const [centerElem, setCenterElem] = useState();
	const [positions, setPositions] = useState([]);
	const [sitters, setSitters] = useState([]);

	const mapRef = useRef();

	



	const onClusterclick = (_target, cluster) => {
		console.log("cluster clicked", _target, cluster);
		const map = mapRef.current;
		// 현재 지도 레벨에서 1레벨 확대한 레벨
		const level = map.getLevel() - 1;
		// 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
		map.setLevel(level, { anchor: cluster.getCenter() });
	};

	const markerClickEvent = (idx) => {
		const map = mapRef.current;
		map.setPosition({
			lat: sitters[idx][1],
			lng: sitters[idx][0],
		})
		console.log(idx)
  }


	useEffect(() => {

	}, []);

	useEffect(() => {
		if (positions.length > 0) {
			setCenterElem(positions[0]);
		}
	}, [positions]);

	if (!centerElem) return <p>로딩중입니다</p>;
	else
		return (
			<>
				<Map
					ref={mapRef}
					center={{ lat: centerElem[1], lng: centerElem[0] }}
					style={{ width: "100%", height: "360px" }}
					onZoomChanged={(map) => setLevel(map.getLevel())}
				>
					<ZoomControl />
					<MarkerClusterer
						averageCenter={false} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
						minLevel={6} // 클러스터 할 최소 지도 레벨
						level={3}
						disableClickZoom={true}
						onClusterclick={onClusterclick}
					>
						{positions.map((pos,idx) => (
							<MapMarker
								key={`pos_${idx}`}
								position={{
									lat: pos[1],
									lng: pos[0],
								}}
								clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
								onClick={()=>markerClickEvent(idx)}
							>
								<div>
									<p style={{display:'inline-block', margin: 0}}>{sitters[idx].userName}</p><span>{sitters[idx].star}</span>
									{/* <span>{Array.from({length: sitters[idx].star}, () => '*')}</span> */}
								</div>
								</MapMarker>
						))}
					</MarkerClusterer>
				</Map>
				{level && <p>{"현재 지도 레벨은 " + level + " 입니다"}</p>}
			</>
		);
};

export default MapIndex;
