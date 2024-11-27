import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { javaFilesApi } from '../../services/javaFileApiHttp';


const initialState: DirectoryInfoJava[] = [] ;

const packagePathsSlice = createSlice({
	name: 'packagePathsSlice',
	initialState,
	reducers: {
		setPackagePaths: (state, action: PayloadAction<DirectoryInfoJava[]>) => {
			return action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addMatcher(javaFilesApi.endpoints?.getPackageInfo.matchFulfilled, (state, action: PayloadAction<{
			success: boolean,
			data: PackageInfoResponseJava
		}>) => {
			return action.payload.data.directories;
		});
	}
});

export const {setPackagePaths} = packagePathsSlice.actions;

export default packagePathsSlice.reducer;
