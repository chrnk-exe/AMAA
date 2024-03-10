import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mobileSocketReducer from './slices/mobileReducer';
import deviceReducer from './slices/currentDeviceReducer';
import appsReducer from './slices/appsReducer';
import {deviceApi} from './services/deviceApi';
import { appsApi } from './services/appApi';

export const store = configureStore({
	reducer: {
		mobileDevices: mobileSocketReducer,
		device: deviceReducer,
		apps: appsReducer,
		[deviceApi.reducerPath]: deviceApi.reducer,
		[appsApi.reducerPath]: appsApi.reducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(deviceApi.middleware)
			.concat(appsApi.middleware)
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