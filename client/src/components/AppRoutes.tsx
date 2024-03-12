import React from 'react';
import {Routes, Route, Navigate} from 'react-router';
import Dashboard from './Dashboard';
import AppPage from './pages/AppPage';
import Analyze from './pages/Analyze';
import Testing from './pages/Testing';

function AppRoutes() {
	return (
		<Dashboard>
			<Routes>
				<Route path="/main" element={<AppPage devices={[]}/> }/>
				<Route path="/device" element={<Analyze />} />
				<Route path="/testing" element={<Testing/>}>
					<Route path="/testing/1" element={<Testing/>} />
				</Route>
				<Route path="*" element={<Navigate to={'/main'}/> }/>

			</Routes>
		</Dashboard>);
}

export default AppRoutes;