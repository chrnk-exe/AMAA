import React, {useState, KeyboardEvent} from 'react';
import Box from '@mui/material/Box';
import { useParams } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../../hooks/typedReduxHooks';
import { execCommand } from '../../../store/slices/shellSlice';
import Typography from '@mui/material/Typography';
import { useSendCommandMutation } from '../../../store/services/shellApiWs';
import '../../../styles/shellExecInput.css';

function ShellPanel() {
	const {pid} = useParams();
	const [command, setCommand] = useState<string>('');
	const dispatch = useAppDispatch();
	const [sendCommand] = useSendCommandMutation();

	const shell = useAppSelector(state => state.shells.find(shell => pid && shell.pid === +pid));

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if(e.key === 'Enter' && pid){
			dispatch(execCommand({
				pid: +pid,
				command
			}));
			sendCommand({
				pid: +pid, cmd: command
			});
			setCommand('');
		}
	};

	if (!Number.isNaN(Number(pid))) {
		if (shell) {
			return (
				<Box sx={{
					width: '100%',
					height: '100%'
				}}>
					<Box sx={{
						borderBottom: 1, borderColor: 'divider'
					}}>
						<Typography>Shell device id: {shell && shell.deviceId}</Typography>
					</Box>
					{shell && shell.output.map((outputString, index) => (
						<Typography key={index}>
							{outputString}
						</Typography>
					))}
					<Box mt={1}>
						{'>>>'}<input className={'shellExecInput'} value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={handleKeyDown}/>
					</Box>
				</Box>
			);
		} else {
			return <Box>Shell not found</Box>;
		}

	} else {
		return <Box>Invalid pid</Box>;
	}


}

export default ShellPanel;