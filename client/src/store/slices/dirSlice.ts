import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: Directory[] = [];


const directoriesSlice = createSlice({
	name: 'dirSlice',
	initialState,
	reducers: {
		setFilesystem: (state, action: PayloadAction<Directory[]>) => {
			return action.payload;
		}
	}
});

export const {
	setFilesystem
} = directoriesSlice.actions;
export default directoriesSlice.reducer;