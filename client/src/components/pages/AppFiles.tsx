import React from 'react';
import { Box, Button } from '@mui/material';
import {useParams} from 'react-router';
import { useNavigate } from 'react-router';

// path - url encoded path, это нужно для кодирования '/' символа,
// всё для того, чтобы по кнопке <назад> можно было вернуться на папку назад)))
const AppFiles = () => {
	const { path } = useParams();
	const navigate = useNavigate();


	const goToRootDirectory = () => {
		navigate('/filesystem/%2F');
	};


	if (path) {
		return (
			<Box>Here will be path and files!</Box>
		);
	} else {
		return (
			<Box sx={{width: '100%', height: '100%', bgcolor: '#FFFFFF'}}>
				Here instructions and link to root folder (/)!
				<Button variant={'contained'} onClick={goToRootDirectory}>Start</Button>
			</Box>
		);
	}
};


export default AppFiles;