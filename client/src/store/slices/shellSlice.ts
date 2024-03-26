import {createSlice, PayloadAction} from '@reduxjs/toolkit';

let pids = 2;

const initialState: shell[] = [{
	pid: 1,
	output: ['>>>whoami','root'],
	deviceId: 'barebone'
}, {
	pid: 2,
	output: ['>>>id','uid=0(root) gid=0(root) groups=0(root) context=u:r:magisk:s0'],
	deviceId: 'barebone'
}];


const shellSlice = createSlice({
	name: 'shellSlice',
	initialState,
	reducers: {
		addShell: (state: shell[]) => {
			pids = pids + 1;
			return [...state, { pid: pids, output: [''], deviceId: 'barebone' }];
		},
		removeShell: (state: shell[], action: PayloadAction<number>) => {
			return state.filter(shell => shell.pid != action.payload);
		},
		execCommand: (state: shell[], action: PayloadAction<{pid: number, command: string}>) => {
			const {pid, command} = action.payload;
			const currentShell = state.find(shell => shell.pid === pid);
			if (currentShell){
				const output = command === 'whoami' ? 'root' : 'uid=0(root) gid=0(root) groups=0(root) context=u:r:magisk:s0';
				currentShell.output.push(`>>>${command}`);
				currentShell.output = [...currentShell.output, output];
			}
		}
	}
});

export const {
	addShell,
	removeShell,
	execCommand
} = shellSlice.actions;
export default shellSlice.reducer;
