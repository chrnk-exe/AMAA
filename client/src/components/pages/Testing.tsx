import React, {FC} from 'react';
import Box from '@mui/material/Box';
import { useLazyScanFSQuery } from '../../store/services/javaFileApiHttp';


const Testing: FC = () => {
	const [scan, {isLoading}] = useLazyScanFSQuery();


	return (
		<Box>

		</Box>
	);
};

export default Testing;