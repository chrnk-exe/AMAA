import React, { FC, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip, TextField, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import skullLogo from '../../../assets/skull_red.svg';
import { useLazyKillProcessQuery } from '../../../store/services/processApi';
import { useAppSelector, useAppDispatch } from '../../../hooks/typedReduxHooks';
import { removeProcess } from '../../../store/slices/appsReducer';

interface props {
	processes?: Process[]
}

const ProcessesTable: FC<props> = () => {
	const [filterString, setFilterString] = useState<string>('');
	const [killProcess] = useLazyKillProcessQuery();

	const dispatch = useAppDispatch();
	const processes = useAppSelector(state => state.apps.processes);

	
	const killProcessFn = async (pid: number) => {
		const result = await killProcess(pid.toString());
		if (result.status === 'rejected') {
			alert('Error! Process doesn\'t exist!');
		} else if (result.status === 'fulfilled') {
			dispatch(removeProcess(pid));
		}
	};

	return (
		<Table sx={{bgcolor: '#FFFFFF', my: 1, borderRadius:2}}>
			<TableHead>
				<TableCell>№</TableCell>
				<TableCell>PID</TableCell>
				<TableCell>
					<Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
						Process Name
						<TextField
							placeholder={'Process name filter'}
							onChange={(e) => setFilterString(e.target.value)}/>
					</Box> </TableCell>
				{/*<TableCell>Parameters</TableCell>*/}
				<TableCell>Actions</TableCell>
			</TableHead>
			<TableBody>
				{
					processes.filter((process) => process.name.includes(filterString)).map((process, index) =>(
						<TableRow key={process.pid}>
							<TableCell>{index+1}</TableCell>
							<TableCell>{process.pid}</TableCell>
							<TableCell>{process.name}</TableCell>
							<TableCell>
								{/*todo: start app*/}
								<Tooltip title={'Try to kill'} placement={'top'}>
									<IconButton onClick={() => killProcessFn(process.pid)}>
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