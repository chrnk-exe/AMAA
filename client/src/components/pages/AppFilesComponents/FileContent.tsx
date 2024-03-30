import React, {FC, useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface props {
	data: string;
	size: number | undefined;
}

const FileContent: FC<props> = ({data, size}) => {
	const [readyData, setReadyData] = useState('');
	const [error, setError] = useState(false);
	const [sizeError, setSizeError] = useState(false);

	useEffect(() => {
		try {
			// Если больше миллиона, то хуй скачаешь через веб сокеты
			if (size && size > 1000000) {
				setSizeError(true);
			} else {
				setError(false);
				setReadyData(atob(data));
			}
		} catch (err) {
			setError(true);
			console.log(err);
		}
	}, [data]);

	return (
		<Box>

			{
				error && <Typography sx={{color: 'yellow'}}>
					Во время декодирования произошла ошибка, содержимое файла может быть искажено.
				</Typography>

			}
			{
				sizeError && <Typography sx={{color: 'red'}}>
					Файл слишком велик для отображения.
				</Typography>
			}
			<pre>
				{readyData}
			</pre>
		</Box>
	);
};


export default FileContent;