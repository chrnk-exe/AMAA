import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mobileSocketReducer from './slices/mobileReducer'


export const store = configureStore({
    reducer: {
        mobileSocket: mobileSocketReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;