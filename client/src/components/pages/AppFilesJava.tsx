import React, {useState} from 'react';
import { Box, Typography, TextField, Grid, Card, CardContent } from '@mui/material';
import { Apps as DefaultAppIcon, CheckCircle as ActiveAppIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/typedReduxHooks';
import { useParams } from 'react-router';
import FilesJava from './AppFilesJavaComponents/JavaFiles';


const AppFiles = () => {

	const {appIdentifier} = useParams();

	console.log(appIdentifier);

	const apps = useAppSelector(state => state.apps.apps);
	const [search, setSearch] = useState('');

	if (appIdentifier) {
		return <FilesJava/>;
	} else return (
		<Box display={'flex'} justifyContent={'center'} alignItems={'center'} m={2} flexDirection={'column'}>
			{/*Header*/}
			<Box m={1}>
				<Typography variant={'h6'}>Браузер файлов приложения</Typography>
				<TextField onChange={(e) => setSearch(e.target.value)} placeholder={'Имя приложения'} sx={{backgroundColor: '#fff'}}/>
			</Box>
			{/*Applications*/}
			<Box>
				<Grid container spacing={2}>
					{apps.filter(app => search ? app.name.includes(search) : app).map((app, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<Link
								to={`/filesystemJava/${app.identifier}/files`}
								style={{
									textDecoration: 'none', // Убираем подчеркивание
									color: 'inherit',       // Наследуем цвет текста
								}}>
								<Card
									sx={{
										width: '100%',
										minWidth: 250,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										padding: 2,
										textAlign: 'center',
									}}
								>
									{app.pid === 0 ? (
										<DefaultAppIcon sx={{ fontSize: 50, color: 'gray' }} />
									) : (
										<ActiveAppIcon sx={{ fontSize: 50, color: 'green' }} />
									)}
									<CardContent sx={{ width: '100%', textAlign: 'center' }}>
										<Typography variant="h6">{app.name}</Typography>
										<Typography variant="body2" color="text.secondary">
											{app.identifier}
										</Typography>
									</CardContent>
								</Card>
							</Link>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>);
};

export default AppFiles;