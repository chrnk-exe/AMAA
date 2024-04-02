import React from 'react';
import { Box, Button, Typography, Link as MuiLink, ListItem, List } from '@mui/material';
import {useParams, Outlet, useNavigate} from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/typedReduxHooks';

// path - url encoded path, это нужно для кодирования '/' символа,
// всё для того, чтобы по кнопке <назад> можно было вернуться на папку назад)))
const AppFiles = () => {
	const {path} = useParams();
	const navigate = useNavigate();
	const downloadLinks = useAppSelector(state => state.downloadLinks);
	const dispatch = useAppDispatch();

	const goToRootDirectory = () => {
		navigate('/filesystem/%2F');
	};


	if (path) {
		// Тут надо показывать файлики и их содержимое
		return (
			<Outlet/>
		);
	} else {
		// Тут должна быть заглушка
		return (
			<Box display={'flex'} sx={{width: '100%', height: '100%', bgcolor: '#FFFFFF'}}>
				<Box display={'flex'}
					 flexDirection={'column'}
					 alignItems={'flex-start'}
					 justifyContent={'flex-start'}
					 gap={2}
					 p={2}
					 sx={{borderColor: 'divider', borderRight: 1, width:'50%'}}>
					<Typography>
						Для начала работы с файлами на устройстве нажмите кнопку {'"Начать"'}!
					</Typography>
					<Button fullWidth variant={'contained'} onClick={goToRootDirectory}>Начать</Button>
					<Typography color={'warning'}>
						Не редактируйте бинарные файлы (или sqlite)!
					</Typography>
					<Typography>
						Не скачивайте большие папки, особенно целые разделы!
					</Typography>
					<Typography>
						При скачивании целой папки или большого файла начнётся его скачивание с выбранного устройства, а затем справа в разделе Stash появится на него ссылка.
						В момент готовности файла придёт уведомление.
					</Typography>
				</Box>
				<Box p={2}>
					<Typography variant={'h4'}>
						Stash
					</Typography>
					<List>
						{
							downloadLinks.map((link, index) => (
								<ListItem key={index}>
									<MuiLink download={link.link} href={link.link}>{link.filename}</MuiLink>
								</ListItem>
							))
						}
					</List>

				</Box>

			</Box>
		);
	}
};


export default AppFiles;