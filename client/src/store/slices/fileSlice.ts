import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState: DeviceFile[] = [{
	name: 'Hello.txt',
	data: 'TW9ja3VwIGZpbGU='
}];


const fileSlice = createSlice({
	name: 'fileSlice',
	initialState,
	reducers: {
		setFileContents: (state, action: PayloadAction<DeviceFile[]>) => {
			return action.payload;
		},
		addFile: (state, action: PayloadAction<DeviceFile>) => {
			return [...state, action.payload];
		},
		// Добавляет к существующему либо создаёт новый
		appendFileData: (state, action: PayloadAction<DeviceFile>) => {
			const newFile = state.find(file => file.name === action.payload.name);
			if (newFile) {
				newFile.data += action.payload.data;
			} else {
				return [...state, action.payload];
			}
		}
	}
});

export const {
	setFileContents,
	addFile,
	appendFileData
} = fileSlice.actions;
export default fileSlice.reducer;