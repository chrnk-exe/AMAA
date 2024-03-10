import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { deviceApi } from '../services/deviceApi';

const initialState: Apps = [];

export const appsSlice = createSlice({
	name: 'appsSlice',
	initialState,
	reducers: {
		setApps: (state: Apps, action: PayloadAction<Apps>) => {
			state = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(deviceApi.endpoints.selectDevice.matchFulfilled, (state, action) => {
			state = action.payload;
		});
	}
});

export const { setApps } = appsSlice.actions;
export default appsSlice.reducer;