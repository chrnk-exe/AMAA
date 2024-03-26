import React, {FC, useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import {useGetMessagesQuery} from '../../store/services/shellApiWs';
import { useAppSelector } from '../../hooks/typedReduxHooks';
import { Outlet, useNavigate, useParams } from 'react-router';

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
}

function LinkTab(props: LinkTabProps) {
	const navigate = useNavigate();
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
			{...props}
		/>
	);
}

const ShellExec: FC = () => {
	const [value, setValue] = useState(0);
	// const {pid} = useParams();
	// console.log(`[SHELLEXEC] ${pid}`);
	const shells = useAppSelector(state => state.shells);


	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		if (newValue !== -1) setValue(newValue);
	};

	const handleAddShell = () => {
		alert('Not implemented!');
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
							<LinkTab label={`shell ${shell.pid}`} key={index} href={shell.pid.toString()}/>
						))
					}
					<Tab
						value={-1}
						icon={<IconButton onClick={handleAddShell}><AddIcon/></IconButton>}
						iconPosition={'end'}/>
				</Tabs>
			</Box>
			<Box>
				<Outlet />
			</Box>
		</Box>
	);
};

export default ShellExec;