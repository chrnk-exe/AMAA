import React, { FC, useState, ChangeEvent } from 'react';
import {
	Box, Button,
	FormControl, FormControlLabel,
	SelectChangeEvent, Switch,

} from '@mui/material';
import { useGetDeviceListQuery, useLazySelectDeviceQuery } from '../../store/services/deviceApi';
import { useLazyGetAppsQuery, useLazyGetProcessesQuery } from '../../store/services/appApi';
import { InputLabel, MenuItem, Select } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/typedReduxHooks';
import { setDevice } from '../../store/slices/currentDeviceReducer';
import Image from '../Image';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import AppsTable from './AnalyzeTables/AppsTable';
import ProcessesTable from './AnalyzeTables/ProcessesTable';


const Analyze: FC = () => {
	// React states
	const [deviceLabel, setDeviceLabel] = useState<string>('');
	const [showProcesses, setShowProcesses] = useState<boolean>(false);

	// Getting device list
	const { data } = useGetDeviceListQuery();

	// Select device function, redirects to get apps
	const [selectDevice, selectedDevice] = useLazySelectDeviceQuery();
	const [getApps, getAppsState] = useLazyGetAppsQuery();
	const [getProcesses, getProcessesState] = useLazyGetProcessesQuery();


	const dispatch = useAppDispatch();
	const apps = useAppSelector(state => state.apps.apps);
	const processes = useAppSelector(state => state.apps.processes);


	// const device = useAppSelector(state => state.device) as Device;


	// On select device - get his apps and save info, clear last data
	const onSelectDevice = async (e: SelectChangeEvent<string>) => {
		// console.log('clearing apps');
		const deviceId = e.target.value as string;
		if (data){
			const deviceToSet = data.find(device => device.impl.id === deviceId);
			if(deviceToSet){
				dispatch(setDevice(deviceToSet));
				setDeviceLabel(deviceId);
				selectDevice({ deviceId, type: showProcesses ? 'processes' : 'apps'});
			}
		}
	};

	// on tumbler - check a data in storage - show data. If no data in storage - get data and show it.
	const showProcessesHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const IsShowProcesses = e.target.checked as boolean;
		if (IsShowProcesses){
			if(processes.length === 0){
				getProcesses();
			}
			setShowProcesses(true);
		} else {
			if(apps.length === 0){
				getApps();
			}
			setShowProcesses(false);
		}
	};

	// Refresh apps and processes.
	const refreshHandler = () => {
		getApps();
		getProcesses();
	};


	return (
		<Box sx={{m: 2}}>
			<Box display={'flex'} justifyContent={'flex-start'} flexDirection={'row'} alignItems={'center'} gap={1}>
				<FormControl sx={{minWidth: '180px'}}>
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
							data && data.map(device =>
								(<MenuItem key={device.impl.id} value={device.impl.id}>
									<Image image={device.impl.icon?.image.data} deviceId={device.impl.id} w={16} h={16}/>
									{device.impl.name}
								</MenuItem>)
							)
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
					(selectedDevice.isFetching || getAppsState.isFetching || getProcessesState.isFetching) && <CircularProgress/>
				}
			</Box>
			{
				showProcesses
					? <ProcessesTable processes={processes}/>
					: <AppsTable apps={apps}/>
			}

		</Box>
	);
};

export default Analyze;