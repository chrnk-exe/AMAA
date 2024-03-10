import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: Device | object = {};

export const currentDeviceSlice = createSlice({
	name: 'currentDeviceSlice',
	initialState,
	reducers: {
		setDevice: (state: Device | object, action: PayloadAction<Device>) => {
			return action.payload;
		},
	}
});

export const { setDevice } = currentDeviceSlice.actions;
export default currentDeviceSlice.reducer;