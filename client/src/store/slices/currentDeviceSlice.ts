import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState = '';

export const currentDeviceSlice = createSlice({
	name: 'currentDeviceSlice',
	initialState,
	reducers: {
		setCurrentDevice: (state, action: PayloadAction<string>) => {
			return action.payload;
		},
	},
	// extraReducers: (builder) => {
	// 	builder.addMatcher(deviceApi.endpoints?.selectDevice.matchFulfilled, (state, action) => {
	// 		return action.payload;
	// 	});
	// }
});

export const {setCurrentDevice} = currentDeviceSlice.actions;
export default currentDeviceSlice.reducer;