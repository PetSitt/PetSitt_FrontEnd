import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import {
	Map,
	MapMarker,
	MarkerClusterer,
	ZoomControl,
} from "react-kakao-maps-sdk";
import SearchAddress from './SearchAddress';

const MapIndex = () => {
	const [level, setLevel] = useState();
	const [centerElem, setCenterElem] = useState();
	const [positions, setPositions] = useState([]);
	const [sitters, setSitters] = useState([]);
	const [address, setAddress] = useState();

	const mapRef = useRef();
	const getData = () => {
		setSitters([{
			"objectIdsitterId" : "s2dadwd2s111",
			"userName": "김철수",
			"address": "서울 서초구 서초1동",
			"sitterTitle": "정성을 다해 사랑으로 돌봐드려요",
			"star" : 5.0,
			"location": { 
					"coordinates": [127.01763998406159, 37.27943075229118]
			}
		},
		{
			"objectIdsitterId" : "s2dadwd2s222",
			"userName": "김유저",
			"address": "서울 서초구 서초2동 222-22",
			"sitterTitle": "정성을 다해 사랑으로 돌봐드려요~~ 저도 댕댕이가 있습니다",
			"star" : 4.0,
			"location": { 
					"coordinates": [129.07944301057026, 35.20618517638034]
			}
		},
		{
			"objectIdsitterId" : "s2dadwd2s333",
			"userName": "세번째",
			"address": "서울 서초구 서초3동 333길 33",
			"sitterTitle": "세번째 돌보미 소개 타이틀 세번째 돌보미 소개 타이틀 세번째 돌보미 소개 타이틀",
			"star" : 4.0,
			"location": { 
					"coordinates": [127.02079678472444, 37.490413948014606]
			}
		}])
	};



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
		getData();
	}, []);

	useEffect(()=>{

		setPositions(()=>{
			const positions = [];
			sitters.map((v,i)=>{
				console.log(v,i)
				positions.push(v.location.coordinates);
			})
			return positions;
		});
	},[sitters])

	useEffect(() => {
		if (positions.length > 0) {
			setCenterElem(positions[0]);
		}
	}, [positions]);

	console.log(sitters, positions,positions.length <= 0)

	if (!centerElem || positions.length <= 0) return <p>로딩중입니다</p>;
	else
		return (
			<>
				<SearchAddress setAddress={setAddress}/>
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
						{positions?.map((pos,idx) => (
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
