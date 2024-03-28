import React from 'react';
import { Box } from '@mui/material';
import {useParams} from 'react-router';
import Typography from '@mui/material/Typography';

const Files = () => {
	const { path } = useParams();



	return (
		<Box display={'grid'} gridTemplateColumns={'3fr 8fr'} p={1}>
			<Box sx={{borderRight: 1, borderColor: 'divider'}}>
				<Box>
					<Typography>
						Current path: {path}
					</Typography>
				</Box>
				<Box>
					Files
				</Box>
			</Box>
			<Box ml={1}>
				File content
			</Box>
		</Box>
	);
};

export default Files;