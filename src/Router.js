import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// page
import Home from './page/Home';
import Detail from './page/Detail';
import Signup from './page/Signup';
import Login from './page/Login';
import SearchAddress from './page/SearchAddress';
import PwFind from "./page/PwFind";
import IdFind from "./page/IdFind";
import Mypage from "./page/Mypage";
import Myprofile from "./page/Myprofile";
import Petprofile from "./page/Petprofile";
import PetprofileForm from "./page/PetprofileForm";
import PwChange from "./page/PwChange";
import Reservation from "./page/Reservation";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} exact />
				<Route path="/detail/:id" element={<Detail />} exact />
				<Route path='/signup' element={<Signup/>} />
				<Route path='/pwfind' element={<PwFind/>} />
				<Route path='/idfind' element={<IdFind/>} />
				<Route path='/mypage' element={<Mypage/>}  />
				<Route path='/mypage/myprofile' element={<Myprofile/>} />
				<Route path='/mypage/petprofile' element={<Petprofile/>} />
				<Route path='/mypage/petprofileform' element={<PetprofileForm/>} />
				<Route path='/mypage/:petId/petprofileform' element={<PetprofileForm/>}/>
				<Route path='/pwchange/:id' element={<PwChange/>} />
				<Route path="/login" element={<Login/>}></Route>
				<Route path="/search" element={<SearchAddress/>}></Route>
				<Route path="/reservation" element={<Reservation/>}></Route>
				<Route path="*" element={<Home replace to="/"/>} />
			</Routes>
		</BrowserRouter>
	);
};

export default Router;