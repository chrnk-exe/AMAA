import React, {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router';
import Dashboard from './Dashboard';
import AppPage from './pages/MainPage';
import Analyze from './pages/Analyze';
import Testing from './pages/Testing';
import ShellExec from './pages/ShellExec';
import ShellPanel from './pages/shellExecComponents/shellPanel';
import socket from '../utils/socket';
import {useAppDispatch, useAppSelector} from '../hooks/typedReduxHooks';
import {addShell, recieveCommandOutput, removeShell, setShells} from '../store/slices/shellSlice';
import {addToFilesystem} from '../store/slices/lsFS/dirSlice';
import AppFiles from './pages/AppFiles';
import Files from './pages/AppFilesComponents/Files';
import {appendFileData} from '../store/slices/lsFS/fileSlice';
import {addConsoleState} from '../store/slices/fridaConsoleState';
import FridaScripting from './pages/FridaScripting';
import HTTPSProxy from './pages/HTTPSProxy';
import StaticAnalyzer from './pages/StaticAnalyzer';
import AppFilesJava from './pages/AppFilesJava';
import FilesJava from './pages/AppFilesJavaComponents/JavaFiles';
import { setDynamicState, setStaticState } from '../store/slices/scanStates';

function AppRoutes() {
	const dispatch = useAppDispatch();
	const device = useAppSelector(state => state.device);

	// commandResult - вывод команды вместе с индексом консоли
	// spawnedShell - информация об удачном спавне шелла
	// shellsList - список текущих шеллов
	// killResult - удачное или неудачное убийство процесса шелла

	//onStartApp
	useEffect(() => {
		console.log('APP ROUTES MOUNTED!');


		// shell socket commands
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
			if (data.pid) {
				dispatch(removeShell(data.pid));
			}
		});

		socket.on('commandResult', (data: CommandResultResponse) => {
			console.log('Received command output:', data);
			dispatch(recieveCommandOutput(data));
		});

		// files commands

		socket.on('directoryContent', (data: Directory[]) => {
			console.log('Directory content: ', data);
			dispatch(addToFilesystem(data));
		});

		socket.on('fileContent', (data: DeviceFile) => {
			console.log('File content: ', data);
			dispatch(appendFileData(data));
		});

		// todo: Download file

		socket.on('downloadFinished', () => {
			console.log('Download finished!');
			alert('Ахтунг, довнлоад финишед!');
		});

		socket.on('fridaConsoleEvent', (data: string) => {
			console.log('Console frida event!');
			dispatch(addConsoleState(data));
		});

		socket.on('staticAnalyzeEv', (data: string) => {
			dispatch(setStaticState(data));
		});

		socket.on('dynamicAnalyzeEv', (data: string) => {
			dispatch(setDynamicState(data));
		});




		// clear listners
		return () => {
			socket.removeAllListeners();
			console.log('Socket removed listeners!');
		};

	}, [device]);


	return (
		<Dashboard>
			<Routes>
				<Route path="/main" element={<AppPage devices={[]}/>}/>
				<Route path="/device" element={<Analyze/>}/>
				<Route path="/scanFS" element={<Testing/>}/>
				<Route path={'/filesystem'} element={<AppFiles/>}>
					<Route path={'/filesystem/:path'} element={<Files/>}/>
				</Route>
				<Route path={'/filesystemJava'} element={<AppFilesJava/>}>
					<Route path={'/filesystemJava/:appIdentifier/files'} element={<FilesJava/>}/>
				</Route>
				<Route path="/shellExec" element={<ShellExec/>}>
					<Route path={'/shellExec/:pid'} element={<ShellPanel/>}></Route>
				</Route>
				<Route path="/custom-scripts" element={<FridaScripting />}/>
				<Route path="/proxy" element={<HTTPSProxy />}/>
				<Route path="/scanner" element={<StaticAnalyzer />}/>
				<Route path="*" element={<Navigate to={'/main'}/>}/>

			</Routes>
		</Dashboard>);
}

export default AppRoutes;