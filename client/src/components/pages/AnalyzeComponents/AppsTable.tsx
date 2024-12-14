import React, {FC} from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AdbIcon from '@mui/icons-material/Adb';
import skullLogo from '../../../assets/skull_green.svg';
import {useLazySpawnApplicationQuery} from '../../../store/services/appApi';

interface props {
	apps: Apps
}

const AppsTable: FC<props> = ({ apps }) => {
	const [spawnApp] = useLazySpawnApplicationQuery();

	const onSimpleStart = async (appPackageName: string) => {
		const pid = await spawnApp(appPackageName);
		console.log(pid);

	};

	return (
		<Table sx={{bgcolor: '#FFFFFF', my: 1, borderRadius:2}}>
			<TableHead>
				<TableCell>№</TableCell>
				<TableCell>Идентификатор процесса</TableCell>
				<TableCell>Имя приложения</TableCell>
				<TableCell>Имя пакета</TableCell>
				<TableCell>Действия</TableCell>
				{/*<TableCell>Parameters</TableCell>*/}
			</TableHead>
			<TableBody>
				{
					apps.map((app, index) =>(
						<TableRow key={app.identifier}>
							<TableCell>{index+1}</TableCell>
							<TableCell>{app.pid}</TableCell>
							<TableCell>{app.name}</TableCell>
							<TableCell>{app.identifier}</TableCell>
							<TableCell>
								{/*todo: start app*/}
								<Tooltip title={'Start'} placement={'top'}>
									<IconButton onClick={() => onSimpleStart(app.identifier)}>
										<PlayArrowIcon htmlColor={'lightgreen'}/>
									</IconButton>
								</Tooltip>
								{/*todo: send to frida-scripting folder*/}
								<Tooltip title={'Send to frida-scripts'} placement={'top'}>
									<IconButton onClick={() => alert('Будет скоро')}>
										<SendIcon htmlColor={'lightgreen'}/>
									</IconButton>
								</Tooltip>
								{/*todo: start with default objection script (ssl-pinning)*/}
								<Tooltip title={'Start with SSL-Unpinning'} placement={'top'}>
									<IconButton onClick={() => alert('Будет скоро!')}>
										<LockOpenIcon htmlColor={'lightgreen'}/>
									</IconButton>
								</Tooltip>
								{/*todo: start with default objection script (root)*/}
								<Tooltip title={'Start with Root-undetect script'} placement={'top'}>
									<IconButton onClick={() => alert('Будет скоро!')}>
										<AdbIcon htmlColor={'lightgreen'}/>
									</IconButton>
								</Tooltip>
								<Tooltip title={'Start with both bypasses'} placement={'top'}>
									<IconButton onClick={() => alert('Будет скоро!')}>
										<img src={skullLogo} alt={''} height={24}/>
										{/*<SvgIcon htmlColor={'lightgreen'}/>*/}
									</IconButton>
								</Tooltip>
							</TableCell>
							{/*<TableCell>{app.parameters}</TableCell>*/}
						</TableRow>
					))
				}
			</TableBody>
		</Table>
	);
};

export default AppsTable;