import React from 'react';
import { Box, Button, Typography, Link as MuiLink, ListItem, List } from '@mui/material';
import {useParams, Outlet, useNavigate} from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/typedReduxHooks';


const AppFiles = () => {
	const { path } = useParams();

	return <Box>AppFiles Java</Box>;
};

export default AppFiles;