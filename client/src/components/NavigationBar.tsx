import React, {type FC, useState} from 'react';
import { Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {useAppSelector} from '../hooks/typedReduxHooks';
import { useLocation, useNavigate } from 'react-router';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import QuizIcon from '@mui/icons-material/Quiz';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import JavascriptIcon from '@mui/icons-material/Javascript';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import SourceIcon from '@mui/icons-material/Source';

interface Props {
	open: boolean
}

interface navItem {
	text: string,
	link: string,
	icon: any,
	subitems?: navItem[]
}

export const NavigationList: navItem[] = [
	{
		text: 'Главная',
		link: '/main',
		icon: <DescriptionIcon/>
	},
	{
		text: 'Менеджер устройств',
		link: '/device',
		icon: <VideoSettingsIcon/>
	},
	// {
	// 	text: 'Testing',
	// 	link: '/testing',
	// 	icon: <QuizIcon />,
	// 	subitems: Array.from([...Array(10).keys()], (x) => ({
	// 		link: `/testing/${x+1}`,
	// 		text: `M${x+1}`
	// 	}))
	//
	// },
	// {
	// 	text: 'Pre-scan results',
	// 	link: '/pre-scan',
	// 	icon: <CompareArrowsIcon />
	// },
	{
		text: 'Дин. тестирование',
		link: '/custom-scripts',
		icon: <JavascriptIcon />
	},
	{
		text: 'Файловый менеджер (ls)',
		link: '/filesystem',
		icon: <FolderIcon />
	},
	{
		text: 'Файловый менеджер (Java)',
		link: '/filesystemJava',
		icon: <FolderIcon />
	},
	{
		text: 'Исполнение команд',
		link: '/shellExec',
		icon: <ArrowForwardIosIcon/>
	},
	{
		text: 'Прокси-сервер',
		link: '/proxy',
		icon: <MultipleStopIcon/>
	},
	{
		text: 'Сканнеры',
		link: '/scanner',
		icon: <SourceIcon/>
	}
];


const NavigationBar: FC<Props> = ({open}) => {
	// const user = useAppSelector(state => state.user);
	const location = useLocation();
	const navigate = useNavigate();

	const [openTestingFolder, setOpenTestingFolder] = useState<boolean>();

	const onTestingClick = () => {
		navigate('/testing');
		setOpenTestingFolder(!openTestingFolder);
	};

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
							!item.subitems
								?
								(<ListItem key={item.link} sx={
									{
										px: open ? undefined : 0,
										py: 0,
										transition: '0.15s padding ease'
									}
								}>
									<ListItemButton onClick={() => navigate(item.link)} selected={item.link === location.pathname.split('/')[0]}>
										<ListItemIcon sx={{minWidth:'30px'}}>{item.icon}</ListItemIcon>
										<ListItemText sx={{whiteSpace: 'nowrap', wordWrap: 'break-word'}}>{item.text}</ListItemText>
									</ListItemButton>
								</ListItem>)
								: (<React.Fragment key={item.link}>
									<ListItem sx={
										{
											px: open ? undefined : 0,
											py: 0,
											transition: '0.15s padding ease'
										}
									}>
										<ListItemButton onClick={onTestingClick} selected={item.link === location.pathname}>
											<ListItemIcon>{item.icon}</ListItemIcon>
											<ListItemText sx={{whiteSpace: 'nowrap'}}>{item.text}</ListItemText>
										</ListItemButton>
									</ListItem>
									<Collapse in={openTestingFolder} >
										<Box m={1}>
											{
												item.subitems.map((subitem, index) => (
													<ListItem key={subitem.link} sx={
														{
															px: open ? undefined : 0,
															py: 0,
															transition: '0.15s padding ease'
														}}>
														<ListItemButton onClick={() => navigate(subitem.link)}>
															<ListItemText>{subitem.text}</ListItemText>
														</ListItemButton>
													</ListItem>
												))
											}
										</Box>
									</Collapse>
								</React.Fragment>)

						))
					}
				</List>
			</Box>
		</Box>
	);
};

export default NavigationBar;