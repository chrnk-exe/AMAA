import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: DownloadLink[] = [{
	filename: 'file.json',
	link: 'http://localhost:31337/files/ru.nspk.mirpay.tar.gz'
}];


const downloadableSlice = createSlice({
	name: 'downloads',
	initialState,
	reducers: {
		addLink: (state, action: PayloadAction<DownloadLink>) => {
			return [...state, action.payload];
		},
		removeLink: (state, action: PayloadAction<string>) => {
			return state.filter(link => link.filename !== action.payload);
		}
	}});

export const {
	addLink,
	removeLink
} = downloadableSlice.actions;

export default downloadableSlice.reducer;