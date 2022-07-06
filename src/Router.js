import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
// page
import Home from './page/Home';
import Detail from './page/Detail';
import Signup from './page/Signup';
import MapIndex from './page/MapIndex';
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
				<Route path="/detail/:id" component={Detail} />
				<Route path='/signup' component={Signup} />
				<Route path='/pwfind' component={PwFind} />
				<Route path='/mypage' component={Mypage} exact />
				<Route path='/mypage/myprofile' component={Myprofile}/>
				<Route path='/pwchange/:id' component={PwChange}/>
				<Route path="/login" component={Login}></Route>
				<Route path="/search" component={SearchAddress}></Route>
				<Redirect from='*' to='/' />
			</Switch>
		</BrowserRouter>
	);
};

export default Router;