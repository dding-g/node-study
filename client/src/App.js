import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import FileManagePage from './components/views/FileManagePage/FileManagePage';

function App() {
	return (
		<Router>
			<div className="full-page">
				{/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
				<Switch>
					{
			/*
          exact는 path가 정확하게 요청되었을때만 해당 페이지를 response한다
          예를들어 Landingpage의 exact를 빼게 되면 login과 register 모두
          / 를 가지고 있으므로 login, register로 요청해도 Landing페이지가 보여진다
          */}
					<Route exact path="/" component={LandingPage} />
					<Route exact path="/login" component={LoginPage} />
					<Route exact path="/register" component={RegisterPage} />
					<Route exact path="/fileManage" component={FileManagePage} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;