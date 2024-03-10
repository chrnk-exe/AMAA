import React from 'react';
import {Routes, Route, Navigate} from 'react-router';
// import AppPage from './AppPage';
import {useGetDeviceListQuery} from '../store/services/deviceApi';
import Dashboard from './Dashboard';
import AppPage from './AppPage';
import Analyze from './Analyze';

function AppRoutes() {
	return (
		<Dashboard>
			<Routes>
				<Route path="/main" element={<AppPage devices={[]}/> }/>
				<Route path="/device" element={<Analyze />}/>
				<Route path="*" element={<Navigate to={'/main'}/> }/>

			</Routes>
		</Dashboard>);
}

export default AppRoutes;