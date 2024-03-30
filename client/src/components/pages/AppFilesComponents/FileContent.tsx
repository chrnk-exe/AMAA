import React, {FC, useState, useEffect} from 'react';
import Box from '@mui/material/Box';

interface props {
	data: string;
}

const FileContent: FC<props> = ({data}) => {
	const [readyData, setReadyData] = useState('');
	const [error, setError] = useState(false);

	useEffect(() => {
		try {
			setError(false);
			setReadyData(atob(data));
		} catch (err) {
			setError(true);
			console.log(err);
		}
	}, [data]);

	return (
		<Box>
			{
				error && 'Во время декодирования произошла ошибка, содержимое файла может быть искажено.'
			}
			<pre>
				{readyData}
			</pre>
		</Box>
	);
};


export default FileContent;