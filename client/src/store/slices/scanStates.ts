import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState = {
	dynamicState: '',
	staticState: ''
};

const scansState = createSlice({
	name: 'scansState',
	initialState,
	reducers: {
		setDynamicState: (state, action: PayloadAction<string>) => {
			return {...state, dynamicState: action.payload};
		},
		setStaticState: (state, action: PayloadAction<string>) => {
			return {...state, staticState: action.payload};
		},
	}
});

export const {setDynamicState, setStaticState} = scansState.actions;

export default scansState.reducer;
