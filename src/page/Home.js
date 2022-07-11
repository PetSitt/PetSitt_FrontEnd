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


function Home() {
	const datepickerRef = useRef();
	const today = new DateObject();
	const cookies = new Cookies();
	const queryClient = useQueryClient();
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
	const getSittersList = (queriesData, category) => {
		if(category.length > 0){
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
	const {data: sitters_query, isLoading: sitterListIsLoading, isFetched: listIsFetched, isSuccess: sitterListSuccess} = useQuery(
		["sitter_list", queriesData, category],
		() => getSittersList(queriesData, category),
		{
			onSuccess: (data) => {
				console.log(data);
			},
			onError: (data) => {
				console.error(data);
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
	const {data: sitters_default_query, isFetched: defaultIsFetched, isLoading: sitterDefaultIsLoading, isSuccess: sitterDefaultSuccess, refetch: refetchList} = useQuery(
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
	},[])

	console.log(defaultSearch, 'defaultSearch')
	useEffect(()=>{
		// if(sitterListSuccess){
		// 	console.log('? 1111')
		// 	setSitters(sitters_query.data.sitter2);
		// }
		// console.log()
		console.log(listIsFetched, defaultIsFetched, sitterListSuccess, sitterDefaultSuccess)
		if(sitterDefaultSuccess){
			console.log('? 222')
			setSitters(sitters_default_query.data.sitters);
		}
		if(defaultIsFetched){
			queryClient.invalidateQueries('sitter_default');
			setSitters(sitters_default_query.data.sitters);
		}
	}, [sitterListSuccess, sitterDefaultSuccess, listIsFetched, defaultIsFetched])
	useEffect(()=>{
		if(sitters?.length > 0){
			if(addressInfo &&  dates?.length > 0){
				console.log('검색 후 categorizing')
			}else{
				console.log(category, 'changed')
				refetchList(category);			
			}
		}
	},[category])



	

	// useEffect(() => {
	// 	checkUser()
	// }, []);
	

	if (sitterListIsLoading) return null;
	return (
		<div className="home" style={{padding: '20px 0'}}>
			<FilterArea>
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
			</SittersListArea>
		</div>
	);
}

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
						margin-top: -3px;
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
