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
  const [dateAndAddress, setDateAndAddress] = useState({searchDate: '', data: ''});
	const [category, setCategory] = useState([]);
  const [data, setData] = useState();

  

	const getSittersList = (date, region, category) => {
		return apis.getSittersList(date, region, category);
	};
	const sitters_query = useQuery(
		"sitter_list",
		() => getSittersList("2022/07/11", "마포구", "데이 케어"),
		{
			onSuccess: (data) => {
				console.log(data);
			},
			onError: (data) => {
				console.error(data);
			},
		}
	);
	useEffect(() => {
		if (date.length) {
			const getDates = date.map((v) => {
				return `${v.year}/${v.month.number < 10 ? '0' + v.month.number : v.month.number}/${v.day}`;
			});
			setDates(getDates);
		}
	}, [date]);

	useEffect(()=>{
		if(addressInfo){
			setAddress(
				{
					address: addressInfo.address_name,
					region_1depth_name: addressInfo.region_1depth_name,
					region_2depth_name: addressInfo.region_2depth_name,
					region_3depth_name: addressInfo.region_3depth_name,
					coordinates: [addressInfo.x, addressInfo.y]
				}
			)
		}
	},[addressInfo])

	useEffect(()=>{
		if(dates?.length && address?.address){
			setDateAndAddress({data: address, searchDate: dates})
		}
	}, [dates, address])

	useEffect(()=>{
		if(dateAndAddress.data.address && dateAndAddress.searchDate.length ){
			console.log(dateAndAddress)
		}
	},[dateAndAddress])

	useEffect(() => {
		// navigator.geolocation.getCurrentPosition(function(pos) {
		//     console.log(pos);
		//     var latitude = pos.coords.latitude;
		//     var longitude = pos.coords.longitude;
		// });
	}, []);

	if (sitters_query.isLoading) return null;
	if (sitters_query.isFetched) return <p>fetched</p>
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
			{/* <ul>
        {
          sitters_query.data.data.sitters.map((v,i)=>{
            return (
              <li key={i}>
                {v.address}
              </li>
            )
          })
        }
      </ul> */}
		</div>
	);
}

export default Home;
