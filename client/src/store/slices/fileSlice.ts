import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState: DeviceFile[] = [];


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
		},
		deleteFile: (state, action: PayloadAction<string>) => {
			return state.filter(fileContent => fileContent.name !== action.payload);
		}
	}
});

export const {
	setFileContents,
	addFile,
	appendFileData,
	deleteFile
} = fileSlice.actions;
export default fileSlice.reducer;