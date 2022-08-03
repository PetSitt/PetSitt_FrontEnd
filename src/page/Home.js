import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Cookies } from "react-cookie";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { DateObject,Calendar } from "react-multi-date-picker";
import styled, {keyframes} from 'styled-components';
import { apis } from "../store/api";

import MapContainer from "./MapContainer";
import SearchAddress from "./SearchAddress";
import icon_star from '../assets/img/icon_star.png';
import StyledButton from "../elements/StyledButton";
import ExceptionArea from '../components/ExceptionArea';
import Loading from '../elements/Loading';
// import MarketingArea from "../components/MarketingArea"; 마케팅 종료로 해당 코드 주석처리
import sitterBgDefault from '../assets/img/img_sitter_bg_default.png';
import sitterDefault from '../assets/img/img_sitter_default.png'

const limit = 6;

function Home({prevIsDetail}) {
	const navigate = useNavigate();
	const datepickerRef = useRef();
	const today = new DateObject();
	const cookies = new Cookies();
	const queryClient = useQueryClient();
	const filterAreaRef = useRef();
	const [date, setDate] = useState([]);
	const [dates, setDates] = useState([]);
	const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
	const [addressInfo, setAddressInfo] = useState();
	const [iframeDisplay, setIframeDisplay] = useState(false);
	const categories = ['산책', '훈련', '데이케어', '1박케어', '목욕 및 모발관리'];
  const [queriesData, setQueriesData] = useState({});
	const [category, setCategory] = useState([]);
	const [searched, setSearched] = useState(false);
	const [sitters, setSitters] = useState([]);
	const [currentPosition, setCurrentPosition] = useState();
	const [defaultSearch, setDefaultSearch] = useState(false);
	const [viewType, setViewType] = useState('list');
	const [locationItems, setLocationItems] = useState();
	const [contentHeight, setContentHeight] = useState();
	const getLocationButtonRef = useRef();
	const [datepickerDisplay, setDatepickerDisplay] = useState(false);
	const [modalDisplay, setModalDisplay] = useState();
	const [offset, setOffset] = useState(0);
	const [target, setTarget] = useState(null);
	const [hasNext, setHasNext] = useState(true);
	const showModal = useRef(false);
	const datesTransformed= useRef(null);
	const [sitterCardShow, setSitterCardShow] = useState({display: false, index: null});
	const categoryClicked = useRef(false);
	const showTooltip = useRef(true);
	const dataToSend = useRef({
		userEmail: null,
		userName: null,
	})
	const [searchingStatus, setSearchingStatus] = useState('searching');
	// const [marketing, setMarketing] = useState(false); 마케팅 종료로 해당 코드 주석처리
	const timeoutRef = useRef();

	const getSittersList = (queriesData, category) => {
		const _queriesData = {...queriesData, category: category.length ? category : []};
		return apis.getSittersList(_queriesData);
	};
	const {data: sittersFilteredSearch} = useQuery(
		["sitter_list", queriesData, category],
		() => getSittersList(queriesData, category),
		{
			onSuccess: (data) => {
				setSearched(false);
				setSitters(data.data.sitters);
				setSearchingStatus('done');
				sessionStorage.removeItem('searchedData');
			},
			onError: (data) => {
				setSearched(false);
				sessionStorage.removeItem('searchedData');
			},
			enabled: !!searched,
			staleTime: Infinity,
		},
	);

	const setDatesFormat = () => {
		if (date.length > 0) {
			datesTransformed.current = null;
			const getDates = date.map((v,i) => {
				return v.format(v._format);
			});
			setDates(getDates);
			const dateItem = `${date[0].month.number < 10 ? '0' + date[0].month.number : date[0].month.number}. ${date[0].day} (${weekDays[date[0].weekDay.index]})`;
			datesTransformed.current = dateItem;
			if(date.length > 1){
				datesTransformed.current = `${dateItem} 외 ${date.length-1}일`
			}
		}else{
			datesTransformed.current = [];
		}
	}
	useEffect(()=>{
		// 날짜, 장소 모두 검색했을 경우
		if(dates.length && addressInfo){
			setQueriesData({searchDate: dates, region_2depth_name: addressInfo.region_2depth_name, x: addressInfo.x, y: addressInfo.y});
		}
		// 날짜, 장소 모두 설정하지 않았을 경우
		if(!dates.length && !addressInfo){
			// 날짜, 장소 모두 검색하라는 tooltip 노출
			showTooltip.current = true;
			const tooltipTimeout = setTimeout(()=>{
				showTooltip.current = false;
				clearTimeout(tooltipTimeout);
			},5000);
			// setDefaultSearch(true);
		}
	}, [dates, addressInfo]);

	// 로그인 여부 확인하는 api
	const { mutate: checkUser } = useMutation(()=>apis.checkUser(), { 
		onSuccess: (data) => {
			localStorage.setItem('userName', data.data.user.userName);
			localStorage.setItem('userEmail', data.data.user.userEmail);
		},
		onError: (data) => {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('kakaoToken');
			localStorage.removeItem('userName');
			localStorage.removeItem('userEmail');
			cookies.remove('refreshToken');
		},
		staleTime: Infinity,
	});

	const getListApi = (currentPosition, category, offset, limit) =>{
		return apis.getSittersDefault({...currentPosition, category, offset, limit});
	}
	const {data: sittersBeforeSearch, refetch: refetchSitters, isRefetching: sittersIsRefetching} = useQuery(
		["sitter_default", currentPosition, category, offset, limit], () => getListApi(currentPosition, category, offset, limit),
		{
			onSuccess: (data) => {
				// queryClient.invalidateQueries('sitter_default');
				setDefaultSearch(false);
				setSearchingStatus('done');

				if(offset === 0){
					setSitters(data.data.sitter);
				} else {
					setSitters([...sitters, ...data.data.sitter]);
				}
				setOffset(offset + limit);
				setHasNext(data.data.next[0]);
			},
			onError: (data) => {
				setDefaultSearch(false);
			},
			enabled: !!defaultSearch,
			staleTime: 1000,
			cacheTime: 0,
		},
	);

  const {mutate: kakaoLoginQuery} = useMutation((data)=>apis.kakaoLogin(data), {
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.token);
			localStorage.setItem('userName', dataToSend.current.userName);
			localStorage.setItem('userEmail', dataToSend.current.userEmail);
    },
    onError: (data) => {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('kakaoToken');
			localStorage.removeItem('userName');
			localStorage.removeItem('userEmail');
			cookies.remove('refreshToken');
    },
  })
  const getKakaoProfile = async () => {
    try {
      // Kakao SDK API를 이용해 사용자 정보 획득
      let data = await window.Kakao.API.request({
        url: "/v2/user/me",
      });
      // 사용자 정보 변수에 저장
      dataToSend.current = {
        userEmail: data.kakao_account.email,
        userName: data.properties.nickname,
      };
      kakaoLoginQuery({
        userEmail: data.kakao_account.email,
        userName: data.properties.nickname,
      });
    } catch (err) {
    }
  };
	const getLocation = () => {
    if (navigator.geolocation) {
			const cancel = setTimeout(()=>{
				setSearchingStatus('delayed');
				clearTimeout(cancel);
			}, 7000);
			timeoutRef.current = cancel;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
					clearTimeout(cancel);
					const latitude = pos.coords.latitude;
					const longitude = pos.coords.longitude;
					setCurrentPosition({x: longitude, y: latitude});
					setDefaultSearch(true);
					const locationObj = {
						x: longitude,
						y: latitude,
						expire: Date.now() + 180000,
					}
					localStorage.setItem('locationInfo', JSON.stringify(locationObj));
        },
        (err) => {
					clearTimeout(cancel);
					if(err.code === 3) setSearchingStatus('delayed');
					if(err.code === 1) setSearchingStatus('blocked');
        },
        {
          enableHighAccuracy: false,
          maximumAge: 180000,
          timeout: 8000,
        }
      );			
    } else {
			setSearchingStatus('blocked');
    }
  };

	const setStoredData = (data) => {
		setDates(data.dates);
		setAddressInfo(data.address);
		setCategory(data.category);
		datesTransformed.current = data.datesText;
	}
	useEffect(()=>{
		if(localStorage.getItem('kakaoToken')){
			getKakaoProfile();
		}else if(localStorage.getItem('accessToken')){
			checkUser();
		}
		const searchedData = JSON.parse(sessionStorage.getItem('searchedData'));
		// 이전 페이지가 상세페이지였고 검색했던 데이터가 있을 경우
		// 저장된 데이터로 state 저장
		if(prevIsDetail && searchedData){
			setStoredData(searchedData);
			setDate(()=>{
				return searchedData.dates.map(v=>{
					return new Date(v);
				})
			});
		}else{
			// 이전에 저장된 실시간 위치 정보 저장되어있는지 확인
			const isLocationInfo = JSON.parse(localStorage.getItem('locationInfo'));		
			if(isLocationInfo && isLocationInfo.expire > Date.now()){
				// location 정보 저장되어 있으면 저장된 정보로 돌보미 검색
				setCurrentPosition({x:isLocationInfo.x, y:isLocationInfo.y});
				setDefaultSearch(true);
			}else{
				// 없을경우 위치정보 재검색
				localStorage.removeItem('locationInfo');
				getLocationButtonRef.current.click();
			}
		}
		
		let fullHeight = window.innerHeight;
		let filterHeight = filterAreaRef.current.clientHeight;
		setContentHeight(fullHeight - filterHeight - 74);
		
		const tooltipTimeout = setTimeout(()=>{
			showTooltip.current = false;
			clearTimeout(tooltipTimeout);
		},5000);
		const timeoutId = timeoutRef.current;
		// 마케팅 종료로 해당 코드 주석처리
		// if(window.innerWidth < 769 && !sessionStorage.getItem('marketingOnMobile')){
		// 	setMarketing(true);
		// }
		return()=>{
			clearTimeout(tooltipTimeout);
			clearTimeout(timeoutId);
			setSitters([]);
		}		
	},[])
	console.log(showTooltip.current)

	useEffect(()=>{
		// 카테고리 버튼 클릭했을 경우
		if(categoryClicked.current){
			if(addressInfo &&  dates?.length > 0){
				queryClient.invalidateQueries('sitter_list');
				setSearched(true);
			}else{
				queryClient.invalidateQueries('sitter_default');
				setDefaultSearch(true);
			}
		};
		categoryClicked.current = false;
	},[category]);
	
	useEffect(()=>{
		// 주소, 날짜 모두 선택했을 경우 검색 실행
		if(dates.length && addressInfo){
			queryClient.invalidateQueries('sitter_list');
			setQueriesData({searchDate: dates, region_2depth_name: addressInfo.region_2depth_name, x: addressInfo.x, y: addressInfo.y, category});
			setSearched(true);
		}

		// 선택한 주소, 날짜 둘다 없을 경우 위치기반으로 돌보미 리스트 검색(검색 후 주소, 날짜 다시 삭제했을 경우를 위해 추가)
		if(!dates.length && !addressInfo && !sessionStorage.getItem('searchedData')){
			showTooltip.current = true;
			const tooltipTimeout = setTimeout(()=>{
				showTooltip.current = false;
				clearTimeout(tooltipTimeout);
			},5000);
			const isLocationInfo = JSON.parse(localStorage.getItem('locationInfo'));
			if(isLocationInfo && isLocationInfo.expire > Date.now()){
				// 저장된 위치정보 있고 3분 지나지 않았을 경우 그대로 가져오기
				setCurrentPosition({x:isLocationInfo.x, y:isLocationInfo.y});
				setDefaultSearch(true);
			}else{
				// 저장된 위치정보 없을 경우 실시간 위치 정보 다시 불러오기
				localStorage.removeItem('locationInfo');
				getLocationButtonRef.current.click();
			}
		}
	}, [dates, addressInfo])

	useEffect(()=>{
		if(sitters?.length > 0){
			// 가격에 쉼표 추가
			for(let i=0; i<sitters.length; i++){
				const priceString = String(sitters[i].servicePrice);
				sitters[i].servicePrice = priceString.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
			}
			// 카카오맵에 전달할 위도,경도 정보 저장
			setLocationItems(()=>{
				const positionItems = [];
				sitters.map((v,i)=>{
					const obj = {x: v.location.coordinates[0], y: v.location.coordinates[1], sitterName: v.sitterName ? v.sitterName : '돌보미', averageStar: v.averageStar, index: i};
					positionItems.push(obj);
				})
				return positionItems;
			})
		}

	},[sitters, sittersIsRefetching]);
  
  useEffect(() => {
		let options = {
      threshold: "1",
    };

    let handleIntersection = ([entries], observer) => {
			if (entries.isIntersecting) {
				hasNext && refetchSitters();
				// window.localStorage.setItem('scrollY', window.scrollY);
        observer.unobserve(entries.target);
      }
    };
		
		const io = new IntersectionObserver(handleIntersection, options);
		if (target) io.observe(target);

		return () => {
			io && io.disconnect();
		}
	},[target, offset]);
  
	const deleteAddressInfo = () => {
		setAddressInfo(null);
	};
	const deleteDates = () => {
		setDate([]);
		setDates([]);
		datesTransformed.current = [];
	};
	return (
		<>
		{/* 마케팅 종료로 해당 코드 주석처리 */}
		{/* <HomePage className={marketing ? 'home marketingOn' : 'home'} style={{position: 'relative', backgroundColor: '#fff'}}> */}
		<HomePage className={'home'} style={{position: 'relative', backgroundColor: '#fff'}}>
			<button type="button" onClick={getLocation} ref={getLocationButtonRef} style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0}}></button>
			<IndexPage>
				<FilterArea ref={filterAreaRef}>
					<div className="searchWrap" style={{position: 'relative'}}>
						<div style={{position: 'relative'}}>
							<div className="inputBox">
								<input type="text" placeholder="주소를 검색해주세요." value={addressInfo ? addressInfo?.address_name : ''} onClick={()=>{setIframeDisplay(true); setDatepickerDisplay(false)}} readOnly/>
								{
									addressInfo && <ClearAddressButton type="button" onClick={()=>deleteAddressInfo()}><i className='ic-close'></i>주소 삭제</ClearAddressButton>
								}
								<i className="ic-search"></i>
							</div>
							{
								iframeDisplay && (
									<AddressWrap style={{margin: '0 -1px'}}>
										<SearchAddress setAddressInfo={setAddressInfo} iframeDisplay={iframeDisplay} setIframeDisplay={setIframeDisplay}/>
										<StyledButton _title="닫기" _margin="0" _onClick={()=>setIframeDisplay(false)}/>
									</AddressWrap>
								)
							}
						</div>
						<div style={{position: 'relative', zIndex: 2}}>
							<div className="inputBox date">
								<input type="text" placeholder="날짜를 선택해주세요." value={datesTransformed.current?.length > 0 ? datesTransformed.current : ''} onClick={()=>{setDatepickerDisplay(true); setIframeDisplay(false)}} readOnly/>
								{
									datesTransformed.current?.length > 0 && <ClearAddressButton type="button" onClick={()=>deleteDates()}><i className='ic-close'></i>날짜 삭제</ClearAddressButton>
								}
								<i className="ic-calendar"></i>
							</div>
							<DatepickerWrap style={{display: datepickerDisplay === true ? 'block' : 'none', position: 'absolute', left: '0', right: '0', top: '100%', marginTop: '-1px'}}>
								<Calendar
									ref={datepickerRef}
									value={date}
									onChange={setDate}
									multiple={true}
									format="YYYY/MM/DD"
									minDate={new Date()}
									maxDate={new Date(today.year + 1, today.month.number, today.day)}
									shadow={false}
									weekDays={weekDays}
									months={months}
									style={{
										borderRadius: 0,
									}}
								/>
								<StyledButton _title="닫기" _margin="0" _onClick={()=>{setDatepickerDisplay(false); setDatesFormat()}}/>
							</DatepickerWrap>
						</div>
						{
							(showTooltip.current && (!dates.length && !addressInfo)) && <Tooltip className={showTooltip.current ? 'aniClass' : ''}>장소와 날짜 모두 선택해주세요.</Tooltip>
						}
					</div>
					<Categories>
						<ul>
						{categories.map((v, i) => {
							return (
								<li key={i}>
									<label>
										<input type="checkbox" onChange={(e) => {
											categoryClicked.current = true;
											if(categoryClicked.current){
												if(e.target.checked){ 
													setCategory((prev)=>{
														const new_category = [...prev];
														new_category.push(v);
														return new_category;
													})
												}else{
													setCategory((prev)=>{
														const new_category = [...prev];
														return new_category.filter(item=>{
															return item !== v;
														})
													})
												}
											}
										}}
										checked={category && category.includes(v)}
										/>
										<span>{v}</span>
									</label>
								</li>
							);
						})}
						</ul>
					</Categories>
				</FilterArea>
				<SittersListArea style={{position: 'relative'}}>
					{
						searchingStatus === 'searching' ? (
							<LoadingWrap>
								<Loading _text={'주변의 돌보미 리스트를 검색중입니다.'} _position={'relative'} _margin={'10vh 0'}/>
							</LoadingWrap>
						) : searchingStatus === 'delayed' ? (
							<ExceptionArea _title={'GPS 확인이 지연되고있어요.'} _text={'장소 및 날짜 검색 기능을 통해 통해 돌보미 리스트를 검색해주세요.'}><TryAgainButton type="button" onClick={getLocation}>다시 시도하기</TryAgainButton></ExceptionArea>
						) : searchingStatus === 'blocked' ? (
							<ExceptionArea _title={'GPS를 허용해주세요.'} _text={'GPS를 허용하지 않을 경우, 장소 및 날짜 검색 기능을 통해 돌보미 리스트를 검색해주세요.'}/>
						) : (
							sitters?.length > 0 ? (
								<>
								{
									(viewType === 'list')
									? (

									<ul>
										{
											sitters?.map((v,i)=>{
												return (
													<SitterCard key={`sitter_${i}`}>
														<LinkButton type="button" onClick={(e)=>{
															e.preventDefault();
															if(dates.length && addressInfo){
																const data = {
																	dates: dates,
																	address: addressInfo,
																	category: category,
																	datesText: datesTransformed.current,
																}
																sessionStorage.setItem('searchedData', JSON.stringify(data));
															}
															navigate(`/detail/${v.sitterId}`);
														}}></LinkButton>
														<div className="image_area" style={{backgroundImage: `url(${v.mainImageUrl ? v.mainImageUrl : sitterBgDefault})`}}>
															<span className="sitter_image" style={{backgroundImage: `url(${v.imageUrl ? v.imageUrl : sitterDefault})`}}></span>
														</div>
														<div className="info_area">
															<p className="sitter">
																<em>{v.sitterName}</em>
																<span>재고용률 {v.rehireRate}%</span>
															</p>
															<p className="address">{v.address}</p>
															<div className="bottom_info">
																<div className="star">
																	<img src={icon_star} alt="star"/>
																	<span>{v.averageStar} </span>
																	<span>{`(${v.reviewCount})`}</span>
																</div>
															</div>
	                          </div>
													</SitterCard>
												)
											})
										}
									</ul>
									) : (
										<MapArea>
											<MapContainer items={locationItems} _height={contentHeight} setSitterCardShow={setSitterCardShow}/>
											{
												<ul style={{background: 'transparent'}}>
													{
														sitterCardShow.display && (
															<SitterCard style={{background: '#fff'}}>
																<LinkButton type="button" onClick={(e)=>{
																	e.preventDefault();
																	if(dates.length && addressInfo){
																		const data = {
																			dates: dates,
																			address: addressInfo,
																			category: category,
																		}
																		sessionStorage.setItem('searchedData', JSON.stringify(data));
																	}
																	navigate(`/detail/${sitters[sitterCardShow.index].sitterId}`);
																}}></LinkButton>
																<div className="image_area" style={{backgroundImage: `url(${sitters[sitterCardShow.index].mainImageUrl})`}}>
																	<span className="sitter_image" style={{backgroundImage: `url(${sitters[sitterCardShow.index].imageUrl})`}}></span>
																</div>
																<div className="info_area">
																	<p className="sitter">
																		<em>{sitters[sitterCardShow.index].sitterName}</em>
																		<span>재고용률 {sitters[sitterCardShow.index].rehireRate}%</span>
																	</p>
																	<p className="address">{sitters[sitterCardShow.index].address}</p>
																	<div className="bottom_info">
																		<div className="star">
																			<img src={icon_star} alt="star"/>
																			<span>{sitters[sitterCardShow.index].averageStar} </span>
																			<span>{`(${sitters[sitterCardShow.index].reviewCount})`}</span>
																		</div>
																		<p className="price"><strong>{sitters[sitterCardShow.index].servicePrice}</strong><span>원~</span></p>
																	</div>
																</div>
																<button type="button" className="closeSitterCard" onClick={()=>setSitterCardShow({display: false, index: null})}>닫기</button>
															</SitterCard>
														)
													}
												</ul>
											}
										</MapArea>
									)
								}
								</>
							) : (
								<>
									{
										(sitters?.length <= 0 ) && <ExceptionArea _title={'검색된 돌보미가 없습니다.'} _text={'검색조건을 바꿔서 검색해보세요.'}/>
									}
								</>
							)
						)
					}
				</SittersListArea>
				<Buttons>
					{
						sitters?.length > 0 && (
							viewType === 'list' ? (
								<button type="button" className="showMapView" onClick={()=>setViewType('map')}><i className="ic-map"></i>지도</button>
							) : (
								<button type="button" className="showListView" onClick={()=>setViewType('list')}><i className="ic-Union"></i>리스트</button>
							)
						)
					}
				</Buttons>
			</IndexPage>
		</HomePage>
		{/* 마케팅 종료로 해당 코드 주석처리 */}
		{/* {
			marketing && <MarketingArea _display={marketing} page='main' setMarketing={setMarketing}/>
		} */}
	</>
	);
}

const HomePage = styled.div`
	/* &.marketingOn{
		height: 100%;
		overflow: hidden;
	} */
`
const LoadingWrap = styled.div`
	position: fixed;
	width: 100%;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 100;
	@media (min-width: 768px){
		max-width: 412px;
		right: 10%;
		left: auto;
	}
`
const IndexPage = styled.div`
.rmdp-container{
	max-width: 100%;
	width: 100%;
	.rmdp-input{
		display: block;
		width: 100%;
		height: 46px;
		line-height: 46px;
		border-radius: 0;
		border: 1px solid #999;
		&:focus{
			box-shadow: none;
		}
	}
}
`
const DatepickerWrap = styled.div`
`
const Buttons = styled.div`
	position: fixed;
	width: 100%;
	bottom: 44px;
	text-align: center;
	pointer-events: none;
	left: 0;
	right: 0;
	z-index: 2;
	@media (min-width: 768px){
		max-width: 412px;
		right: 10%;
		left: auto;
	}
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
		color: #1a1a1a;
		background: #FFFFFF;
		box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(120,120,120,.2);
		border-radius: 20px;
		i{
			display: inline-block;
			vertical-align: middle;
			margin: -2px 5px 0 0;
			color: #FC9215;
		}
		&.showMapView{
			i{
				font-size: 20px;
				margin-top: -4px;
			}
		}
		&.showListView{
			i{
				font-size: 13px;
				margin-right: 7px;
			}
		}
}
`
const FilterArea = styled.div`
position: relative;
z-index: 2;
.searchWrap{
	z-index: 2;
}
.inputBox{
	position: relative;
	input{
		display: block;
		width: 100%;
		height: 48px;
		padding: 0 15px 0 44px;
		border-radius: 6px;
		border: 1px solid rgba(120,120,120,.4);
		box-sizing: border-box;
			font-size: 16px;
		&::placeholder{
			color: rgba(120, 120, 120, 0.7);
		}
	}
	@media screen and (max-width: 400px){
		input{
			min-width: 170px;
			padding-left: 32px;
		}
		.ic-search{
			width: 34px;
			font-size: 20px;
		}
	}
	& > i{
		position: absolute;
		left: 0;
		top: 0;
		font-size: 26px;
		width: 44px;
		height: 48px;
		text-align: center;
		line-height: 48px;
		&::before{
			color: #676767;
		}
		&.ic-calendar{
			line-height: 42px;
			&::before{
				font-size: 20px;
				color: #1a1a1a;
				margin-top: -3px;
			}
		}
	}
	& + div{
		border-radius: 6px;
		overflow: hidden;
		border: 1px solid rgba(120,120,120,.4);
		button{
			border-radius: 0;
		}
	}
	&.date{
		max-width: 60%;
		margin-top: 16px;
		input{
			padding-left: 34px;
		}
		i{
			width: 36px;
		}
		@media screen and (max-width: 375px){
			max-width: 65%;
		}
		@media screen and (max-width: 320px){
			max-width: 100%;
		}
	}
}
.rmdp-container {
	position: relative;
}
 .rmdp-ep-arrow{
	height: 0!important;
	 & + div{
		width: 100%;
		top: 46px!important;
		transform: translate(0,0)!important;
		z-index: 100;
	 }
 }
 .rmdp-ep-arrow[direction=top]:after{
	display: none;
 }
 .rmdp-border{
	border-radius: 0;
	border: none;
 }

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
const SitterCard = styled.li`
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
`
const SittersListArea = styled.div`
	position: relative;
	z-index: 1;
	&::before{
		display: block;
		height: 6px;
		margin: 0 -20px 20px;
		content: '';
		background-color: #F5F5F5;
	}
	ul{
		li{
			position: relative;
		}
	}
`
const AddressWrap = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	border: 1px solid #999;
	margin-bottom: 10px;
	z-index: 100;
`
const MapArea = styled.div`
	position: relative;
	border-radius: 10px;
	overflow: hidden;
	ul{
		position: absolute;
		left: 10px;
		right: 10px;
		top: 10px;
		z-index: 2;
		background-color: #fff;
		.closeSitterCard{
			position: absolute;
			right: 10px;
			top: 10px;
			width: 24px;
			height: 24px;
			background: rgba(0,0,0,.6);
			border-radius: 50%;
			font-size: 0;
			&::before,
			&::after{
				position: absolute;
				left: 0;
				right: 0;
				top: 50%;
				height: 1px;
				background-color: #fff;
				width: 12px;
				margin: 0 auto;
				content: '';
				transform: rotate(-45deg);
			}
			&::after{
				transform: rotate(45deg);
			}
		}
	}
`
const tooltipAnimation = keyframes`
	0%{
		opacity: 1;
	}
	95%{
		opacity: 1;
	}
	100%{
		opacity: 0;
	}
`
const Tooltip = styled.p`
	position: absolute;
	left: 0;
	top: calc(100% + 16px);
	display: inline-block;
	background-color: rgba(25,25,25,.9);
	border-radius: 6px;
	padding: 0 12px;
	line-height: 36px;
	font-size: 14px;
	color: #fff;
	animation: ${tooltipAnimation} 5s forwards;
	pointer-events: none;
	&:before{
		position: absolute;
		left: 50%;
		top: -9px;
		width: 0;
		height: 0;
		border: 7px solid rgba(25,25,25,.9);
		border-top: 2px solid transparent;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		content: '';
	}
`
const TryAgainButton = styled.button`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  padding: 12px 20px;
  background: #ffffff;
  border: 1px solid #fc9215;
  border-radius: 54px;
  color: #fc9215;
	margin-top: 20px;
`;

const ClearAddressButton = styled.button`
	position: absolute;
	right: 10px;
	top: 50%;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background-color: #e9e9e9;
	margin-top: -12px;
		font-size: 0;
	i{
		color: #1a1a1a;
		&::before{
			font-size: 12px;
		}
	}
`
const LinkButton = styled.button`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 2;
`
export default Home;
