import React from 'react';
import {Routes, Route, Navigate} from 'react-router';
// import AppPage from './AppPage';
import {useGetDeviceListQuery} from '../store/services/deviceApi';
import Dashboard from './Dashboard';
import AppPage from './AppPage';

function AppRoutes() {
	const { data } = useGetDeviceListQuery();


	return (
		<Routes>
			<Route path="/" element={<Dashboard> <AppPage devices={data || []}/> </Dashboard>}/>
			<Route path="*" element={<Navigate to={'/'}/> }/>
		</Routes>);

}

export default AppRoutes;