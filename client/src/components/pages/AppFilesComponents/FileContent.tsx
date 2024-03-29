import React, {FC} from 'react';
import Box from '@mui/material/Box';

interface props {
	data: string;
}

const FileContent: FC<props> = ({data}) => {
	return (
		<Box>
			<pre>

			</pre>
		</Box>
	);
};


export default FileContent;