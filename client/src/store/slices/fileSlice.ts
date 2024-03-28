import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: [] = [];


const fileSlice = createSlice({
	name: 'fileSlice',
	initialState,
	reducers: {
		setFilesystem: (state, action: PayloadAction<void>) => {
			return void;
		}
	}
}