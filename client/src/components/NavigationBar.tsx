import React, {type FC} from 'react';
import { Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {useAppSelector} from '../hooks/typedReduxHooks';
import {useNavigate} from 'react-router';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';

interface Props {
	open: boolean
}
const NavigationBar: FC<Props> = ({open}) => {
	// const user = useAppSelector(state => state.user);

	const NavigationList = [
		{
			text: 'Main Page',
			link: '/main',
			icon: <DescriptionIcon/>
		},
		{
			text: 'Analyze',
			link: '/device/:deviceId',
			icon: <VideoSettingsIcon/>
		}
	];

	const navigate = useNavigate();

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="flex-start"
			alignItems="center">
			<Box sx={{width: '100%'}}>
				<List sx={{width: '100%'}}>
					{
						NavigationList.map((item, index) => (
							<ListItem key={item.link} sx={{px: !open ? 0 : undefined}}>
								<ListItemButton onClick={() => navigate(item.link)}>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText>{item.text}</ListItemText>
								</ListItemButton>
							</ListItem>
						))
					}
				</List>
			</Box>
		</Box>
	);
};

export default NavigationBar;