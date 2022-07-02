import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
// page
import Home from './page/Home';
import Signup from './page/Signup';
import MapIndex from './page/MapIndex';
import MapIndex2 from './page/MapIndex2';
import Login from './page/Login';
import SearchAddress from './page/SearchAddress';
import PwFind from "./page/PwFind";
import Mypage from "./page/Mypage";
import Myprofile from "./page/Myprofile";
import PwChange from "./page/PwChange";

const Router = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" component={Home} exact />
				<Route path="/map" component={MapIndex} />
				<Route path='/signup' component={Signup} />
				<Route path='/pwfind' component={PwFind} />
				<Route path='/mypage' component={Mypage} exact />
				<Route path='/mypage/myprofile/:id' component={Myprofile}/>
				<Route path='/pwchange/:id' component={PwChange}/>
				<Route path="/map2" component={MapIndex2} />{/*이 route는 테스트 끝나면 지울게요!*/}
				<Route path="/login" component={Login}></Route>
				<Route path="/search" component={SearchAddress}></Route>
				<Redirect from='*' to='/' />
			</Switch>
		</BrowserRouter>
	);
};

export default Router;