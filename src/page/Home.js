import { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import { Cookies } from "react-cookie";
import { useQuery, useMutation, useQueryClient } from "react-query";
import DatePicker, { DateObject } from "react-multi-date-picker";
import styled from 'styled-components';
import axios from "axios";
import { apis } from "../store/api";

import MapContainer from "./MapContainer";
import SearchAddress from "./SearchAddress";
import icon_star from '../assets/img/icon_star.png';
import icon_map from '../assets/img/icon_map.png';


function Home() {
	const datepickerRef = useRef();
	const today = new DateObject();
	const cookies = new Cookies();
	const queryClient = useQueryClient();
	const filterAreaRef = useRef();
	const [date, setDate] = useState(new Date());
	const [dates, setDates] = useState(new Date());
	const [addressInfo, setAddressInfo] = useState();
	const [address, setAddress] = useState();
	const categories = [
		{ walk: "산책" },
		{ wash: "목욕, 모발 관리" },
		{ prac: "훈련" },
		{ dayCare: "데이 케어" },
		{ boarding: "1박 케어" },
	];
  const [queriesData, setQueriesData] = useState({});
	const [category, setCategory] = useState(categories);
	const [searched, setSearched] = useState(false);
	const [sitters, setSitters] = useState();
	const [currentPosition, setCurrentPosition] = useState();
	const [defaultSearch, setDefaultSearch] = useState(false);
	const [viewType, setViewType] = useState('list');
	const [locationItems, setLocationItems] = useState();
	const [mapHeight, setMapHeight] = useState();
	const getSittersList = (queriesData, category) => {
		if(category.length > 0 && category.length < 5){
			for(let i=0; i<category.length; i++){
				const cate_key = Object.keys(category[i])[0];
				const cate_value = Object.values(category[i])[0];
				queriesData[cate_key] = cate_value;
			}
		}
		console.log(queriesData)
		// return axios.post('http://13.209.49.214:3000/mains/search', queriesData)
		return apis.getSittersList(queriesData);
	};
	const {data: sittersFilteredSearch, isLoading: sittersFilteredIsLoading, isFetched: sittersFilteredIsFetched, isRefetching: sittersAfterIsRefetching} = useQuery(
		["sitter_list", queriesData, category],
		() => getSittersList(queriesData, category),
		{
			onSuccess: (data) => {
				console.log(data);
				setSearched(false);
			},
			onError: (data) => {
				console.error(data);
				setSearched(false);
			},
			enabled: !!searched,
			staleTime: Infinity,
		},
	);
	useEffect(() => {
		if (date.length) {
			const getDates = date.map((v) => {
				return v.format(v._format);
			});
			setDates(getDates);
		}
	}, [date]);

	useEffect(()=>{
		if(dates?.length && addressInfo){
			setQueriesData({searchDate: dates, region_2depth_name: addressInfo.region_2depth_name, x: addressInfo.x, y: addressInfo.y, walk: "산책"})
		}
	}, [dates, addressInfo])

	// 로그인 여부 확인하는 api
	const { mutate: checkUser } = useMutation(()=>apis.checkUser(), { 
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (data) => {
			console.log(data)
		},
		staleTime: Infinity,
	});
	const getListApi = (currentPosition, category) =>{
		const categoryData = {}
		if(category.length > 0 && category.length < 5){
			for(let i=0; i<category.length; i++){
				const cate_key = Object.keys(category[i])[0];
				const cate_value = Object.values(category[i])[0];
				categoryData[cate_key] = cate_value;
			}
		}
		return apis.getSittersDefault({...currentPosition, ...categoryData});
	}
	const {data: sittersBeforeSearch, isFetched: sittersIsFetched, refetch: refetchSitters, isRefetching: sittersIsRefetching} = useQuery(
		["sitter_default", currentPosition, category], () => getListApi(currentPosition, category),
		{
			onSuccess: (data) => {
				console.log(data);
				setDefaultSearch(false);
			},
			onError: (data) => {
				console.error(data);
				setDefaultSearch(false);
			},
			enabled: !!defaultSearch,
			staleTime: Infinity,
		},
	);
	const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
					const latitude = pos.coords.latitude;
					const longitude = pos.coords.longitude;
					setCurrentPosition({x: longitude, y: latitude});
					setDefaultSearch(true);
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    } else {
      alert('GPS를 허용해주세요');
    }
  };

	useEffect(()=>{
		getLocation();
		const fullHeight = window.innerHeight;
		const filterHeight = filterAreaRef.current.clientHeight;
		setMapHeight(fullHeight - filterHeight);
		console.log(fullHeight, filterHeight, fullHeight - filterHeight)
	},[])

	useEffect(()=>{
		console.log('github action test')
		queryClient.invalidateQueries('sitter_default');
		if(sittersFilteredIsFetched){
			const sittersData = sittersFilteredSearch.data.sitter2 ? sittersFilteredSearch.data.sitter2 : sittersFilteredSearch.data.sitters;
			setSitters(sittersData);
			return;
		}
		if(sittersIsFetched){
			setSitters(sittersBeforeSearch.data.sitters);
			return;
		}
	}, [sittersFilteredIsFetched, sittersIsFetched])

	useEffect(()=>{
		if(sitters?.length > 0){
			if(addressInfo &&  dates?.length > 0){
				// 검색 후 categorizing
				console.log('검색 후 categorizing')
			}else{
				// 검색 전 categorizing
				console.log('검색 전 categorizing')
				refetchSitters(category);			
			}
		}
	},[category])

	useEffect(()=>{
		if(sitters?.length > 0 && !sittersIsRefetching){
			// 가격에 쉼표 추가
			for(let i=0; i<sitters.length; i++){
				const length = sitters[i].servicePrice.toString().length;
				const commaLength = length/3;
				let index = 0;
				let priceArray = [];
				priceArray = sitters[i].servicePrice.toString().split('');
				for(let j=1; j<commaLength; j++){
					priceArray.splice(-(3 * j + index), 0, ',');
					index++;					
				}
				sitters[i].servicePrice = priceArray.join('');
			}
			// 카카오맵에 전달할 위도,경도 정보 저장
			setLocationItems(()=>{
				const positionItems = [];
				sitters.map(v=>{
					const obj = {x: v.location.coordinates[0], y: v.location.coordinates[1], userName: v.userName ? v.userName : '돌보미', averageStar: v.averageStar};
					positionItems.push(obj);
				})
				return positionItems;
			})
		}
	},[sitters])
	

	// useEffect(() => {
	// 	checkUser()
	// }, []);
	

	if (sittersFilteredIsLoading) return null;
	return (
		<div className="home" style={{position: 'relative'}}>
			<IndexPage>
				<FilterArea ref={filterAreaRef}>
					<DatePicker
						ref={datepickerRef}
						onChange={setDate}
						multiple={true}
						format="YYYY/MM/DD"
						minDate={date}
						maxDate={new Date(today.year + 1, today.month.number, today.day)}
					/>
					<AddressWrap>
						<SearchAddress setAddressInfo={setAddressInfo} />
					</AddressWrap>
					<button type="button" style={{border: '1px solid #333', fontSize: '16px', height: '40px', lineHeight: '42px', padding: '0 20px'}} onClick={()=>{
						if(addressInfo &&  dates?.length > 0){
							setSearched(true);
						}else{
							window.alert('날짜와 장소를 선택해주세요.')
						}
					}}>검색하기</button>
					<Categories>
						<ul>
						{categories.map((v, i) => {
							return (
								<li key={i}>
									<label>
										<input type="checkbox" onChange={(e) => {
											if(e.target.checked){ 
												setCategory((prev)=>{
													const new_category = [...prev];
													return new_category.filter(item=>{
														return Object.values(item)[0] !== Object.values(v)[0]
													})
												})
											}else{
												setCategory((prev)=>{
													const new_category = [...prev];
													new_category.push(v);
													return new_category;
												})
											}
										}} />
										<span>{Object.values(v)}</span>
									</label>
								</li>
							);
						})}
						</ul>
					</Categories>
				</FilterArea>
				<SittersListArea>
					{
						(viewType === 'list')
						? (
						<ul>
							{
								sitters?.map((v,i)=>{
									return (
										<li key={`sitter_${i}`}>
											<Link to={`/detail/${v.sitterId}`}>
											<div className="image_area" style={{backgroundImage: `url(${v.mainImageUrl})`}}>
												<span className="sitter_image" style={{backgroundImage: `url(${v.imageUrl})`}}></span>
											</div>
											<div className="info_area">
												<p className="sitter">
													<em>{`돌보미`}</em>
													<span>재고용률 {v.rehireRate}%</span>
												</p>
												<p className="address">{v.address}</p>
												<div className="bottom_info">
													<div className="star">
														<img src={icon_star} alt="star"/>
														<span>{v.averageStar} </span>
														<span>{`(54)`}</span>
													</div>
													<p className="price"><strong>{v.servicePrice}</strong><span>원~</span></p>
												</div>
											</div>
											</Link>
										</li>
									)
								})
							}
						</ul>
						) : (
							<MapContainer items={locationItems} _height={mapHeight}/>
						)
					}
					
				</SittersListArea>
				<Buttons>
					{
						viewType === 'list' ? (
							<button type="button" className="showMapView" onClick={()=>setViewType('map')}><i style={{backgroundImage: `url(${icon_map})`}}></i>지도</button>
						) : (
							<button type="button" className="showListView" onClick={()=>setViewType('list')}><i style={{backgroundImage: `url(${icon_map})`}}></i>리스트</button>
						)
					}
				</Buttons>
			</IndexPage>
		</div>
	);
}

const IndexPage = styled.div`

`
const Buttons = styled.div`
	position: sticky;
	left: 0;
	right: 0;
	bottom: 0;
	text-align: center;
	pointer-events: none;
	z-index: 2;
	button{
		position: absolute;
		bottom: 30px;
		left: 50%;
		bottom: 30px;
		transform: translateX(-50%);
		pointer-events: all;
		display: inline-block;
		line-height: 40px;
		height: 40px;
		padding: 0 16px;
		font-size: 16px;
		color: #FC9215;
		background: #FFFFFF;
		box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
		border-radius: 20px;
		i{
			display: inline-block;
			width: 16px;
			height: 16px;
			background-size: contain;
			background-position: center;
			background-repeat: no-repeat;
			vertical-align: middle;
			margin: -2px 5px 0 0;
		}
}
`
const FilterArea = styled.div`

`
const Categories = styled.div`
	overflow: hidden;
	overflow-x: auto;
	margin: 0 -20px;
	padding: 16px 20px 24px;
	&{-ms-overflow-style:none; }
	&::-webkit-scrollbar { display:none; }
	ul{
		display: inline-flex;
		white-space: nowrap;
		gap: 10px;
	}
	label{
		position: relative;
		input{
			position: absolute;
			left: 0;
			top: 0;
			width: 0;
			height: 0;
			& + span{
				display: inline-block;
				padding: 0 12px;
				font-size: 14px;
				color: #787878;
				height: 32px;
				line-height: 32px;
				border-radius: 16px;
				box-sizing: border-box;
				border: 1px solid rgba(120, 120, 120, 0.2);
			}
			&:checked + span{
				color: #FC9215;
				font-weight: 700;
				border: 1px solid transparent;
				background: rgba(252, 146, 21, 0.1);
			}
		}
	}
`
const SittersListArea = styled.div`
	li{
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
		&+li{
			margin-top: 16px;
		}
		.image_area{
			position: relative;
			height: 0;
			padding-bottom: 29.2397%;
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			.sitter_image{
				position: absolute;
				right: 23px;
				bottom: -23px;
				width: 60px;
				height: 60px;
				border-radius: 10px;
				background-size: cover;
				background-position: center;
				background-repeat: no-repeat;
			}
		}
		.info_area{
			padding: 14px 18px;
			color: #1A1A1A;
			.sitter{
				display: flex;
				align-items: center;
				gap: 10px;
				em{
					font-size: 18px;
					line-height: 1;
				}
				span{
					display: inline-block;
					background: rgba(252, 146, 21, 0.1);
					border-radius: 3px;
					padding: 0 5px;
					line-height: 18px;
					height: 16px;
					font-size: 12px;
					font-weight: 500;
					color: #FC9215;
					margin-top: -3px;
				}
			}
			.address{
				font-size: 12px;
				color: #787878;
				margin-top: 6px;
			}
			.bottom_info{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 10px;
				.star{
					display: flex;
					align-items: center;
					font-size: 14px;
					font-weight: 500;
					img{
						display: inline-block;
						width: 13px;
						margin-top: -1px;
						margin-right: 4px;
					}
					span{
						font-weight: 500;
						& + span{
							font-weight: 400;
							margin-left: 2px;
						}
					}
				}
				.price{
					display: flex;
					align-items: center;
					font-size: 14px;
					color: #787878;
					gap: 2px;
					strong{
						color: #1A1A1A;
						font-size: 24px;
						font-weight: 700;
					}
					span{
						margin-top: 2px;
					}
				}
			}
		}
	}
`
const AddressWrap = styled.div`
	height: 45px;
	overflow: hidden;
	border: 1px solid #333;
	margin-bottom: 10px;
	& > div{
		margin-top: -32px;
	}
`
export default Home;
