import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { javaFilesApi } from '../../services/javaFileApiHttp';


const initialState: PackageInfoResponseJava | object = {} ;

const packageForFilesInfoSlice = createSlice({
	name: 'packageForFilesInfoSlice',
	initialState,
	reducers: {
		setPackageInfo: (state, action: PayloadAction<PackageInfoResponseJava>) => {
			return action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addMatcher(javaFilesApi.endpoints?.getPackageInfo.matchFulfilled, (state, action) => {
			return action.payload;
		});
	}
});

export const {setPackageInfo} = packageForFilesInfoSlice.actions;

export default packageForFilesInfoSlice.reducer;
