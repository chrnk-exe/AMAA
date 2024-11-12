import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState = '';

const fridaConsoleState = createSlice({
	name: 'fridaConsoleStateSlice',
	initialState,
	reducers: {
		setConsoleState: (state: string, action: PayloadAction<string>) => {
			return action.payload;
		},
		addConsoleState: (state: string, action: PayloadAction<string>) => {
			return state + '\n' + action.payload;
		},
		clearConsoleState: () => {
			return '';
		}
	}
});

export const {setConsoleState, addConsoleState, clearConsoleState} = fridaConsoleState.actions;

export default fridaConsoleState.reducer;
