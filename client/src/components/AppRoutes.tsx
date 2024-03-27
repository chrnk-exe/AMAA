import React, {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router';
import Dashboard from './Dashboard';
import AppPage from './pages/MainPage';
import Analyze from './pages/Analyze';
import Testing from './pages/Testing';
import ShellExec from './pages/ShellExec';
import ShellPanel from './pages/shellExecComponents/shellPanel';
import socket from '../socket';
import { useAppDispatch } from '../hooks/typedReduxHooks';
import { addShell, recieveCommandOutput, removeShell, setShells } from '../store/slices/shellSlice';

function AppRoutes() {
	const dispatch = useAppDispatch();

	// commandResult - вывод команды вместе с индексом консоли
	// spawnedShell - информация об удачном спавне шелла
	// shellsList - список текущих шеллов
	// killResult - удачное или неудачное убийство процесса шелла
	useEffect(() => {
		console.log('APP ROUTES MOUNTED!');


		socket.on('connect', () => {
			console.log('Connected successfully');
		});

		socket.on('spawnedShell', (data: string) => {
			console.log('Added shell: ', JSON.parse(data));
			const draft = JSON.parse(data);
			dispatch(addShell(draft));
		});

		socket.on('shellsList', (data: ShellsListResponse) => {
			console.log('Current shell list: ', data);
			// what i need to do?
			// Нужно сохранить старый output + посмотреть соответствие пидам и девайс id
			// dispatch(addShell(data));
			// а пока просто все шеллы заменю на пришедшие)))
			dispatch(setShells(data));

		});

		socket.on('killResult', (data: KillMessageResponse) => {
			console.log('Kill shell result: ', data);
			if (data.pid){
				dispatch(removeShell(data.pid));
			}
		});

		socket.on('commandResult', (data: CommandResultResponse) => {
			console.log('Received command output:', data);
			dispatch(recieveCommandOutput(data));
		});

		return () => {
			socket.removeAllListeners();
			console.log('Socket removed listeners!');
		};

	}, []);


	return (
		<Dashboard>
			<Routes>
				<Route path="/main" element={<AppPage devices={[]}/> }/>
				<Route path="/device" element={<Analyze />} />
				<Route path="/testing" element={<Testing/>}>
					<Route path="/testing/1" element={<Testing/>} />
				</Route>
				<Route path="/shellExec" element={<ShellExec />}>
					<Route path={'/shellExec/:pid'} element={<ShellPanel />}></Route>
				</Route>
				<Route path="*" element={<Navigate to={'/main'}/> }/>

			</Routes>
		</Dashboard>);
}

export default AppRoutes;