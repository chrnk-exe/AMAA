import React, {FC} from 'react';
import Box from '@mui/material/Box';
import {useGetMessagesQuery} from '../../store/services/shellApiWs';

const ShellExec: FC = () => {
	const {data} = useGetMessagesQuery();

	console.log(data);

	return (
		<Box></Box>
	);
};

export default ShellExec;