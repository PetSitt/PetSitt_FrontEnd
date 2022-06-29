import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
// page
import Home from './page/Home';
import Signup from './page/Signup';
import MapIndex from './page/MapIndex';

const Router = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" component={Home} exact />
				<Route path="/map" component={MapIndex} />
				<Route path='/signup' component={Signup} />
				<Redirect from='*' to='/' />
			</Switch>
		</BrowserRouter>
	);
};

export default Router;