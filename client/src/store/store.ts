import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mobileSocketReducer from './slices/mobileReducer';
import {deviceApi} from './services/deviceApi';

export const store = configureStore({
	reducer: {
		mobileSocket: mobileSocketReducer,
		[deviceApi.reducerPath]: deviceApi.reducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(deviceApi.middleware)
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