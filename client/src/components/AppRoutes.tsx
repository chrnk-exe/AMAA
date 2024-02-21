import React from 'react';
import {Routes, Route, Navigate} from 'react-router';
import AppPage from './AppPage';
import {useGetDeviceListQuery} from '../store/services/deviceApi';


function AppRoutes() {
	const { data } = useGetDeviceListQuery();


	return (
		<Routes>
			<Route path="/" element={<AppPage devices={data || []}/>}/>
			<Route path="*" element={<Navigate to={'/'}/> }/>
		</Routes>);

}

export default AppRoutes;