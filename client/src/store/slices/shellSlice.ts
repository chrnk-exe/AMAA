import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: shell[] = [];


const shellSlice = createSlice({
	name: 'shellSlice',
	initialState,
	reducers: {
		addShell: (state: shell[], action: PayloadAction<SpawnedShellsResponse>) => {
			return [...state, { ...action.payload, output: [action.payload.output] }];
		},
		removeShell: (state: shell[], action: PayloadAction<number>) => {
			return state.filter(shell => +shell.pid !== +action.payload);
		},
		execCommand: (state: shell[], action: PayloadAction<{pid: number, command: string}>) => {
			const {pid, command} = action.payload;
			const currentShell = state.find(shell => shell.pid === pid);
			if (currentShell){
				currentShell.output.push(`>>>${command}`);
			}
		},
		recieveCommandOutput: (state: shell[], action: PayloadAction<CommandResultResponse>) => {
			const {commandOutput, pid} = action.payload;
			const shell = state.find(shell => shell.pid === +pid);
			const oldShells = state.filter(shell => shell.pid !== +pid);
			// const output = [];
			if (shell) {
				const { deviceId } = shell;
				// const transformedOutput =
				return [...oldShells, {pid, output: [...shell.output, commandOutput], deviceId}].sort((a, b) => (+a.pid) - (+b.pid));
			} else {
				return state;
			}
		},
		setShells: (state: shell[], action: PayloadAction<ShellsListResponse>) => {
			return action.payload.map((shell) => ({...shell, output: [shell.output]}));
		}
	}
});

export const {
	addShell,
	removeShell,
	execCommand,
	recieveCommandOutput,
	setShells
} = shellSlice.actions;
export default shellSlice.reducer;
