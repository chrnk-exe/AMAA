import React, {FC, useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from '../../hooks/typedReduxHooks';
import { Outlet, useNavigate, useParams } from 'react-router';
import {useGetShellsMutation, useSpawnShellMutation, useKillShellMutation} from '../../store/services/shellApiWs';
import CircularProgress from '@mui/material/CircularProgress';

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

	const handleRemoveShell = () => {
		const {pid} = props;
		console.log(pid);
		alert('Not implemented!');
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
			aria-current={props.selected && 'page'}
			icon={<IconButton onClick={handleRemoveShell} sx={{p:0}}><CloseIcon/></IconButton>}
			iconPosition={'end'}
			{...props}
		/>
	);
}

const ShellExec: FC = () => {
	const [value, setValue] = useState(0);
	// const {pid} = useParams();
	// console.log(`[SHELLEXEC] ${pid}`);
	const shells = useAppSelector(state => state.shells);
	const [spawnShell, { isLoading }] = useSpawnShellMutation();


	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		if (newValue !== -1) setValue(newValue);
	};

	const handleAddShell = async () => {
		const result = await spawnShell();
		console.log(result);
	};

	return (
		<Box sx={{ width: '100%', bgcolor: '#FFFFFF', height: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={value}
					onChange={handleChange}
					variant="scrollable"
					scrollButtons="auto">
					{
						shells.map((shell, index) => (
							<LinkTab label={`shell ${shell.pid}`} key={index} href={shell.pid.toString()} pid={shell.pid}/>
						))
					}
					<Tab
						value={0}
						icon={<IconButton onClick={handleAddShell}><AddIcon/></IconButton>}
						iconPosition={'end'}/>
					{
						isLoading && <Tab icon={<CircularProgress/>}/>
					}
				</Tabs>
			</Box>
			<Box>
				<Outlet />
			</Box>
		</Box>
	);
};

export default ShellExec;