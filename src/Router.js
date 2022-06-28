import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
// page
import MapIndex from './page/MapIndex';
import Home from './page/Home';

const Router = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" component={Home} exact />
				<Route path="/map" component={MapIndex} />
				<Redirect from='*' to='/' />
			</Switch>
		</BrowserRouter>
	);
};

export default Router;