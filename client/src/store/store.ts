import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import deviceReducer from './slices/currentDeviceReducer';
import appsReducer from './slices/appsReducer';
import {deviceApi} from './services/deviceApi';
import {appsApi} from './services/appApi';
import {testingApi} from './services/testingApi';
import {shellApiWs} from './services/shellApiWs';
import shellReducer from './slices/shellSlice';
import dirReducer from './slices/dirSlice';
import fileReducer from './slices/fileSlice';
import {fileApiWs} from './services/fileApiWs';
import downloadableFilesReducer from './slices/downloadableFiles';
import avaiableScripts from './slices/avaiableScripts';
import {processApi} from './services/processApi';
import fridaConsoleStateReducer from './slices/fridaConsoleState';
import {staticAnalyzeApi} from './services/staticAnalyzeApi';

export const store = configureStore({
	reducer: {
		device: deviceReducer,
		apps: appsReducer,
		shells: shellReducer,
		files: dirReducer,
		fileContents: fileReducer,
		downloadLinks: downloadableFilesReducer,
		scripts: avaiableScripts,
		fridaConsoleState: fridaConsoleStateReducer,
		[deviceApi.reducerPath]: deviceApi.reducer,
		[appsApi.reducerPath]: appsApi.reducer,
		[testingApi.reducerPath]: testingApi.reducer,
		[shellApiWs.reducerPath]: shellApiWs.reducer,
		[fileApiWs.reducerPath]: fileApiWs.reducer,
		[processApi.reducerPath]: processApi.reducer,
		[staticAnalyzeApi.reducerPath]: staticAnalyzeApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(deviceApi.middleware)
			.concat(appsApi.middleware)
			.concat(testingApi.middleware)
			.concat(shellApiWs.middleware)
			.concat(fileApiWs.middleware)
			.concat(processApi.middleware)
	// .concat(qwe.middleware) // another middleware
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;