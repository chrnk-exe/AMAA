import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import { appsApi } from '../services/appApi';
import { deviceApi } from '../services/deviceApi';

const initialState: Devices = [];

export const mobileDevicesSlice = createSlice({
	name: 'mobile',
	initialState,
	reducers: {
		setSocket: (state: Device[], action: PayloadAction<Device[]>) => {
			state = action.payload;
		},
	}
});

export const { setSocket } = mobileDevicesSlice.actions;
export default mobileDevicesSlice.reducer;