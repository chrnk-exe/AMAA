import React, {FC, useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from '../../hooks/typedReduxHooks';
import { Outlet, useNavigate, useParams } from 'react-router';
import { removeShell } from '../../store/slices/shellSlice';
import {useGetShellsMutation, useSpawnShellMutation, useKillShellMutation} from '../../store/services/shellApiWs';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

function samePageLinkNavigation(
	event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
) {
	if (
		event.defaultPrevented ||
		event.button !== 0 || // ignore everything but left-click
		event.metaKey ||
		event.ctrlKey ||
		event.altKey ||
		event.shiftKey
	) {
		return false;
	}
	return true;
}

interface LinkTabProps {
	label?: string;
	href?: string;
	selected?: boolean;
	pid: number;
}

function LinkTab(props: LinkTabProps) {
	const navigate = useNavigate();
	const {pid} = useParams();
	const dispatch = useAppDispatch();

	const [killShell] = useKillShellMutation();

	const handleRemoveShell = () => {
		const {pid} = props;
		dispatch(removeShell(pid));
		killShell(pid);
		navigate('/shellExec');
	};

	return (
		<Tab
			component="a"
			onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
				// Routing libraries handle this, you can remove the onClick handle when using them.
				if (samePageLinkNavigation(event)) {
					event.preventDefault();
				}
				navigate(`/shellExec/${props.href}`);
			}}
			value={+props.pid}
			icon={<IconButton onClick={handleRemoveShell} sx={{p:0}}><CloseIcon/></IconButton>}
			aria-current={pid && (+pid) === props.pid ? 'page' : undefined}
			iconPosition={'end'}
			{...props}
		/>
	);
}

const ShellExec: FC = () => {
	const [value, setValue] = useState(0);
	const {pid} = useParams();
	const shells = useAppSelector(state => state.shells);
	const [spawnShell] = useSpawnShellMutation();
	const [getShells] = useGetShellsMutation();
	

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		// console.log(event.currentTarget)
		console.log(`Value: ${newValue}`);
		setValue(newValue);
	};

	const handleAddShell = () => {
		spawnShell();
	};

	const getShellsHandler = () => {
		getShells();
	};

	return (
		<Box sx={{ width: '100%', bgcolor: '#FFFFFF', height: '100%' }}>
			<Box display={'flex'}  alignItems={'center'} justifyContent={'flex-start'} sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={value}
					onChange={handleChange}
					variant="scrollable"
					scrollButtons="auto">
					{
						shells.map((shell) => (
							<LinkTab label={`Shell ${shell.pid}`} key={shell.pid} href={shell.pid.toString()} pid={shell.pid}/>
						))
					}
				</Tabs>
				<Box sx={{height: '100%'}} display={'flex'} alignItems={'center'} justifyContent={'center'}>
					<IconButton onClick={handleAddShell}><AddIcon/></IconButton>
				</Box>
			</Box>
			<Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
				{pid
					? <Outlet />
					:<Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} mt={10} gap={2}>
						<Typography>
							Чтобы создать оболочку sh нажмите на {'+'}!
						</Typography>
						<Button variant={'contained'} onClick={getShellsHandler}>
							Получить все доступные оболочки
						</Button>
						<Typography color={'red'}>
							Ввод {'"http://localhost:31337/shellExec"'} в строку URI приводит к потере почти всего вывода всех команд!
						</Typography>
						<Typography color={'red'}>
							Для перехода на эту страницу используй кнопку в меню слева.
						</Typography>
					</Box>}
			</Box>
		</Box>
	);
};

export default ShellExec;