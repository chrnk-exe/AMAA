import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';

import deviceReducer from './slices/currentDeviceReducer';
import appsReducer from './slices/appsReducer';
import shellReducer from './slices/shellSlice';
import downloadableFilesReducer from './slices/lsFS/downloadableFiles';
import availableScripts from './slices/avaiableScripts';
import fridaConsoleStateReducer from './slices/fridaConsoleState';
import currentDeviceReducer from './slices/currentDeviceSlice';
import scansReducer from './slices/scanStates';

import dirReducer from './slices/lsFS/dirSlice';
import fileReducer from './slices/lsFS/fileSlice';

import javaFilesReducer from './slices/javaFS/javaFiles';
import javaPackageInfoReducer from './slices/javaFS/javaPackageInfo';
import javaPackagePathsReducer from './slices/javaFS/packagePaths';

import {deviceApi} from './services/deviceApi';
import {appsApi} from './services/appApi';
import {testingApi} from './services/testingApi';
import {shellApiWs} from './services/shellApiWs';
import {fileApiWs} from './services/fileApiWs';
import {processApi} from './services/processApi';
import {staticAnalyzeApi} from './services/staticAnalyzeApi';
import {javaFilesApi} from './services/javaFileApiHttp';
import {scanApi} from './services/scanApi';

export const store = configureStore({
	reducer: {
		device: deviceReducer,
		apps: appsReducer,
		shells: shellReducer,
		files: dirReducer,
		fileContents: fileReducer,
		downloadLinks: downloadableFilesReducer,
		scripts: availableScripts,
		fridaConsoleState: fridaConsoleStateReducer,
		currentDevice: currentDeviceReducer,
		javaFiles: javaFilesReducer,
		packagePaths: javaPackagePathsReducer,
		package: javaPackageInfoReducer,
		scans: scansReducer,

		[deviceApi.reducerPath]: deviceApi.reducer,
		[appsApi.reducerPath]: appsApi.reducer,
		[testingApi.reducerPath]: testingApi.reducer,
		[shellApiWs.reducerPath]: shellApiWs.reducer,
		[fileApiWs.reducerPath]: fileApiWs.reducer,
		[processApi.reducerPath]: processApi.reducer,
		[staticAnalyzeApi.reducerPath]: staticAnalyzeApi.reducer,
		[javaFilesApi.reducerPath]: javaFilesApi.reducer,
		[scanApi.reducerPath]: scanApi.reducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(deviceApi.middleware)
			.concat(appsApi.middleware)
			.concat(testingApi.middleware)
			.concat(shellApiWs.middleware)
			.concat(fileApiWs.middleware)
			.concat(processApi.middleware)
			.concat(javaFilesApi.middleware)
			.concat(staticAnalyzeApi.middleware)
			.concat(scanApi.middleware)
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