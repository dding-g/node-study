import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './components/views/HomePage/HomePage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import FileManagePage from './components/views/FileManagePage/FileManagePage';
import PostPage from './components/views/FileManagePage/PostPage';
import ChattingPage from './components/views/ChattingPage/ChattingPage';
import Auth from './hoc/Auth';

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Auth(HomePage)} />
				<Route exact path="/login" component={LoginPage} />
				<Route exact path="/register" component={RegisterPage} />
				<Route exact path="/file/test/intellij" component={Auth(FileManagePage)} />
				<Route exact path="/file" component={Auth(FileManagePage)} />
				<Route exact path="/file/post" component={Auth(PostPage)} />
				<Route exact path="/chat" component={Auth(ChattingPage)} />
			</Switch>
		</Router>
	);
}

export default App;