import React, {FC, useState, ChangeEvent, useEffect} from 'react';
import {
	Box, Button,
	FormControl, FormControlLabel,
	SelectChangeEvent, Switch,

} from '@mui/material';
import {
	useGetDeviceListQuery,
	useLazySelectDeviceQuery,
	useLazyGetDeviceListQuery, useAvailableScriptsQuery,useLazyAvailableScriptsQuery
} from '../../store/services/deviceApi';
import {useLazyGetAppsQuery, useLazyGetProcessesQuery} from '../../store/services/appApi';
import {InputLabel, MenuItem, Select} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../hooks/typedReduxHooks';
import {setDevice} from '../../store/slices/currentDeviceReducer';
import Image from '../Image';
import socket from '../../utils/socket';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import AppsTable from './AnalyzeComponents/AppsTable';
import ProcessesTable from './AnalyzeComponents/ProcessesTable';


const Analyze: FC = () => {
	// React states
	const [deviceLabel, setDeviceLabel] = useState<string>('');
	const [showProcesses, setShowProcesses] = useState<boolean>(false);
	const [devices, setDevices] = useState<Device[]>([]);

	// Getting device list
	const {data} = useGetDeviceListQuery();
	const [getDevices] = useLazyGetDeviceListQuery();
	// глупое дерьмо
	const [getScripts] = useLazyAvailableScriptsQuery();

	// Select device function, redirects to get apps
	const [selectDevice, selectedDevice] = useLazySelectDeviceQuery();
	const [getApps, getAppsState] = useLazyGetAppsQuery();
	const [getProcesses, getProcessesState] = useLazyGetProcessesQuery();


	const dispatch = useAppDispatch();
	const apps = useAppSelector(state => state.apps.apps);
	const processes = useAppSelector(state => state.apps.processes);
	// const device = useAppSelector(state => state.device) as Device;

	useEffect(() => {
		if (data) {
			setDevices(data);
		}
	}, [data]);

	useEffect(() => {
		// Если devices изменились, принудительно перерисуем компонент Select
	}, [devices]);

	useEffect(() => {
		return () => {
			socket.disconnect();
			socket.connect();
		};
	}, []);


	// On select device - get his apps and save info, clear last data
	const onSelectDevice = async (e: SelectChangeEvent<string>) => {
		// console.log('clearing apps');
		const deviceId = e.target.value as string;
		if (data) {
			const deviceToSet = data.find(device => device.impl.id === deviceId);
			if (deviceToSet) {
				dispatch(setDevice(deviceToSet));
				setDeviceLabel(deviceId);
				await selectDevice({deviceId, type: showProcesses ? 'processes' : 'apps'});
				// просто получу скрипты и всё.
				getScripts();
			}
		}
	};

	// on tumbler - check a data in storage - show data. If no data in storage - get data and show it.
	const showProcessesHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const IsShowProcesses = e.target.checked as boolean;
		if (IsShowProcesses) {
			if (processes.length === 0) getProcesses();
			setShowProcesses(true);
		} else {
			if (apps.length === 0) getApps();
			setShowProcesses(false);
		}
	};
	//
	// Refresh apps and processes.
	const refreshHandler = () => {
		getApps();
		getProcesses();
	};

	const refreshDevicesHandler = async () => {
		const {data} = await getDevices();
		if (data) {
			setDevices(data);
		}
	};


	return (
		<Box sx={{m: 2}}>
			<Box display={'flex'} justifyContent={'flex-start'} flexDirection={'row'} alignItems={'center'} gap={1}>
				<FormControl sx={{minWidth: '180px'}} onClick={refreshDevicesHandler} >
					<InputLabel id="SelectDevice">Select Device</InputLabel>
					<Select
						labelId="SelectDevice"
						id="SelectDevice"
						value={deviceLabel}
						label="Select device"
						onChange={onSelectDevice}
						sx={{bgcolor: '#FFFFFF'}}
					>
						{
							devices.length !== 0
								?
								devices.map(device =>
									(<MenuItem key={device.impl.id} value={device.impl.id}>
										<Image image={device.impl.icon?.image.data} deviceId={device.impl.id} w={16} h={16}/>
										{device.impl.name}
									</MenuItem>)
								) : (<Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
									<CircularProgress/>
								</Box>)
						}
					</Select>
				</FormControl>
				<FormControlLabel
					control={
						<Switch value={showProcesses} onChange={showProcessesHandler}/>
					}
					label="Show Processes"
				/>
				<Button onClick={refreshHandler} startIcon={<RefreshIcon/>} variant="contained">
					Refresh all
				</Button>
				{
					(selectedDevice.isFetching || getAppsState.isFetching || getProcessesState.isFetching) &&
					<CircularProgress/>
				}
			</Box>
			{
				showProcesses
					? <ProcessesTable />
					: <AppsTable apps={apps}/>
			}

		</Box>
	);
};

export default Analyze;