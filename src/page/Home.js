import { useEffect, useState, useRef } from "react";
import { useQuery } from "react-query";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { apis } from "../store/api";

import MapIndex from "./MapIndex";
import SearchAddress from "./SearchAddress";

const INITIAL_VALUES = [false, false, false];

function Home() {
	const datepickerRef = useRef();
	const today = new DateObject();
	const [date, setDate] = useState(new Date());
	const [dates, setDates] = useState(new Date());
	const [addressInfo, setAddressInfo] = useState();
	const [address, setAddress] = useState();
	const categories = [
		{ walk: "산책" },
		{ wash: "목욕, 모발관리" },
		{ prac: "훈련" },
		{ dayCare: "데이 케어" },
		{ boarding: "1박 케어" },
	];
  const [queriesData, setQueriesData] = useState({});
	const [category, setCategory] = useState([]);
	const [searched, setSearched] = useState(false);

 
	const getSittersList = (queriesData, category) => {
		console.log(queriesData, category)
		return apis.getSittersList(queriesData, category);
	};
	const sitters_query = useQuery(
		"sitter_list",
		() => getSittersList(queriesData, category),
		// () => getSittersList("2022/07/11", "마포구", "데이 케어"),
		{
			onSuccess: (data) => {
				console.log(data);
			},
			onError: (data) => {
				console.error(data);
			},
			enabled: searched,
			staleTime: 10000,
		},
	);
	useEffect(() => {
		if (date.length) {
			const getDates = date.map((v) => {
				return `${v.year}/${v.month.number < 10 ? '0' + v.month.number : v.month.number}/${v.day < 10 ? '0' + v.day : v.day}`;
			});
			setDates(getDates);
		}
	}, [date]);

	useEffect(()=>{
		if(dates?.length && addressInfo){
			setQueriesData({searchDate: dates, region_2depth_name: addressInfo.region_2depth_name, coordinates: [addressInfo.x, addressInfo.y]})
		}
	}, [dates, addressInfo])


	useEffect(() => {
		// navigator.geolocation.getCurrentPosition(function(pos) {
		//     console.log(pos);
		//     var latitude = pos.coords.latitude;
		//     var longitude = pos.coords.longitude;
		// });
	}, []);

	if (sitters_query.isLoading) return null;
	return (
		<div className="home">
			<DatePicker
				ref={datepickerRef}
				onChange={setDate}
				multiple={true}
				format="YYYY/MM/DD"
				minDate={date}
				maxDate={new Date(today.year + 1, today.month.number, today.day)}
			/>
			<SearchAddress setAddressInfo={setAddressInfo} />
			<button type="button" style={{border: '1px solid #333', fontSize: '16px', height: '40px', lineHeight: '42px', padding: '0 20px'}} onClick={()=>{
				if(addressInfo &&  dates?.length > 0){
					setSearched(true);
				}else{
					window.alert('날짜와 장소를 선택해주세요.')
				}
			}}>검색하기</button>
			<ul>
				{categories.map((v, i) => {
					return (
						<li key={i} style={{fontSize: '16px', margin: '10px 0'}}>
							<label>
								<input type="checkbox" onChange={(e) => {
									if(e.target.checked){
										setCategory((prev)=>{
											const new_category = [...prev];
											new_category.push(v);
											return new_category;
										})
									}else{
										setCategory((prev)=>{
											const new_category = [...prev];
											return new_category.filter(item=>Object.keys(item)[0] !== Object.keys(v)[0]);
										})
									}
								}} />
								{Object.values(v)}
							</label>
						</li>
					);
				})}
			</ul>
			<MapIndex />
		</div>
	);
}

export default Home;
