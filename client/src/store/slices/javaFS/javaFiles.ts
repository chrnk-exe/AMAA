import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { javaFilesApi } from '../../services/javaFileApiHttp';


const initialState: FileInfoJava[] = [];

const javaFilesSlice = createSlice({
	name: 'javaFilesSlice',
	initialState,
	reducers: {
		setFiles: (state, action: PayloadAction<FileInfoJava[]>) => {
			return action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addMatcher(javaFilesApi.endpoints?.ls.matchFulfilled, (state, action: PayloadAction<RpcResponseJavaTyped<LsResponseJava>>) => {
			console.log('[javaFilesSlice builder]:',action.payload);
			return action.payload.data.files;
		});
	}
});

export const {setFiles} = javaFilesSlice.actions;

export default javaFilesSlice.reducer;
