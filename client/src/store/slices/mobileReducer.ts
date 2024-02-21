import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: Device[] = [];

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