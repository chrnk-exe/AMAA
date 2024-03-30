import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: Directory[] = [];


const directoriesSlice = createSlice({
	name: 'dirSlice',
	initialState,
	reducers: {
		setFilesystem: (state, action: PayloadAction<Directory[]>) => {
			return action.payload;
		},
		clearFilesystem: () => {
			return [];
		},
		addToFilesystem: (state, action: PayloadAction<Directory[]>) => {
			return [...state, ...action.payload];
		},
		deleteFileOrDirectory: (state, action: PayloadAction<string>) => {
			return state.filter(file => file.fileName !== action.payload);
		}
	}
});

export const {
	setFilesystem,
	clearFilesystem,
	addToFilesystem,
	deleteFileOrDirectory
} = directoriesSlice.actions;
export default directoriesSlice.reducer;