import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {deviceApi} from '../services/deviceApi';


const initialState: string[] = [];

export const scriptsSlice = createSlice({
	name: 'scriptsSlice',
	initialState,
	reducers: {
		setScripts: (state, action: PayloadAction<string[]>) => {
			return action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(deviceApi.endpoints?.availableScripts.matchFulfilled, (state, action) => {
			return action.payload;
		});
	}
});

export const {setScripts} = scriptsSlice.actions;
export default scriptsSlice.reducer;
