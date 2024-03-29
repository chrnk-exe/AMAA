import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {deviceApi} from '../services/deviceApi';
import {appsApi} from '../services/appApi';


const initialState: { apps: App[], processes: Process[] } = {
	apps: [],
	processes: []
};

export const appsSlice = createSlice({
	name: 'appsSlice',
	initialState,
	reducers: {
		setApps: (state, action: PayloadAction<Apps>) => {
			return {apps: action.payload, processes: state.processes};
		},
		clearApps: (state) => {
			return {apps: [], processes: state.processes};
		},
		// todo: find app, change pid, change pid in processes or add new process.
		updatePid: (state, action: PayloadAction<{ packageName: string, pid: number }>) => {
			console.log('Change PID');
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(deviceApi.endpoints.selectDevice.matchFulfilled, (state, action) => {
			return {apps: action.payload, processes: state.processes};
		});
		builder.addMatcher(deviceApi.endpoints.selectDevice.matchRejected, (state) => {
			return {apps: [], processes: state.processes};
		});
		builder.addMatcher(appsApi.endpoints.getApps.matchFulfilled, (state, action) => {
			return {apps: action.payload, processes: state.processes};
		});
		builder.addMatcher(appsApi.endpoints.getProcesses.matchFulfilled, (state, action) => {
			return {apps: state.apps, processes: action.payload};
		});
	}
});

export const {setApps, clearApps} = appsSlice.actions;
export default appsSlice.reducer;