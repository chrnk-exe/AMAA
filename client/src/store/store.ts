import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import deviceReducer from './slices/currentDeviceReducer';
import appsReducer from './slices/appsReducer';
import { deviceApi } from './services/deviceApi';
import { appsApi } from './services/appApi';
import { testingApi } from './services/testingApi';
import { shellApiWs } from './services/shellApiWs';
import shellReducer from './slices/shellSlice';

export const store = configureStore({
	reducer: {
		device: deviceReducer,
		apps: appsReducer,
		shells: shellReducer,
		[deviceApi.reducerPath]: deviceApi.reducer,
		[appsApi.reducerPath]: appsApi.reducer,
		[testingApi.reducerPath]: testingApi.reducer,
		[shellApiWs.reducerPath]: shellApiWs.reducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(deviceApi.middleware)
			.concat(appsApi.middleware)
			.concat(testingApi.middleware)
			.concat(shellApiWs.middleware)
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