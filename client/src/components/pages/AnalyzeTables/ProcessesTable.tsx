import React, {FC} from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AdbIcon from '@mui/icons-material/Adb';
import skullLogo from '../../../assets/skull_red.svg';

interface props {
	processes: Process[]
}

const ProcessesTable: FC<props> = ({ processes }) => {
	return (
		<Table sx={{bgcolor: '#FFFFFF', my: 1, borderRadius:2}}>
			<TableHead>
				<TableCell>№</TableCell>
				<TableCell>PID</TableCell>
				<TableCell>Process Name</TableCell>
				{/*<TableCell>Parameters</TableCell>*/}
				<TableCell>Actions</TableCell>
			</TableHead>
			<TableBody>
				{
					processes.map((process, index) =>(
						<TableRow key={process.pid}>
							<TableCell>{index+1}</TableCell>
							<TableCell>{process.pid}</TableCell>
							<TableCell>{process.name}</TableCell>
							<TableCell>
								{/*todo: start app*/}
								<Tooltip title={'Try to kill'} placement={'top'}>
									<IconButton onClick={() => alert('Not implemented!')}>
										<img src={skullLogo} alt={''} height={24}/>
										{/*<SvgIcon htmlColor={'lightgreen'}/>*/}
									</IconButton>
								</Tooltip>
							</TableCell>
							{/*<TableCell>{process.parameters}</TableCell>*/}
						</TableRow>
					))
				}
			</TableBody>
		</Table>
	);
};

export default ProcessesTable;