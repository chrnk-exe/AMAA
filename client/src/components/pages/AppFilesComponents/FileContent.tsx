import React, {FC, useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import ReactJson from 'react-json-view';
import XMLViewer from 'react-xml-viewer';


interface props {
	data: string;
	size: number | undefined;
	filename: string;
}

const FileContent: FC<props> = ({data, size, filename}) => {
	const extension = filename.split('.')[filename.split('.').length - 1];
	const [alignment, setAlignment] = React.useState<'RAW' | 'XML' | 'JSON' | 'SQLITE'>(extension === 'json' ? 'JSON' : extension === 'xml'? 'XML' : 'RAW');
	const [jsonData, setJsonData] = useState({});
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
				try {
					setJsonData(JSON.parse(atob(data)));
				} catch {
					setJsonData({'Error': 'file is not json'});
				}
			}
		} catch (err) {
			setError(true);
			console.log(err);
		}
	}, [data]);

	const handleAlignment = (
		event: React.MouseEvent<HTMLElement>,
		newAlignment: 'RAW' | 'XML' | 'JSON' | 'SQLITE',
	) => {
		setAlignment(newAlignment);
	};

	return (
		<Box>
			<Typography>File name: {filename}</Typography>
			<ToggleButtonGroup
				value={alignment}
				exclusive
				onChange={handleAlignment}
				aria-label="text alignment"
				sx={{ mb: 1, mt: 1 }}
			>
				<ToggleButton value="RAW" aria-label="left aligned">
					<Typography>RAW</Typography>
				</ToggleButton>
				<ToggleButton value="JSON" aria-label="centered">
					<Typography>JSON</Typography>
				</ToggleButton>
				<ToggleButton value="XML" aria-label="right aligned">
					<Typography>XML</Typography>
				</ToggleButton>
				<ToggleButton disabled value="SQLITE" aria-label="right aligned">
					<Typography>SQLITE</Typography>
				</ToggleButton>
			</ToggleButtonGroup>

			{/*{*/}
			{/*	error && <Typography sx={{ color: 'yellow' }}>*/}
			{/*		Во время декодирования произошла ошибка, содержимое файла может быть искажено.*/}
			{/*	</Typography>*/}

			{/*}*/}
			{
				sizeError && <Typography sx={{ color: 'red' }}>
					Файл слишком велик для отображения.
				</Typography>
			}
			{
				alignment === 'RAW'
					? <pre>{readyData}</pre>
					: alignment === 'JSON'
						? <ReactJson src={jsonData}/>
						: <XMLViewer xml={readyData}/>

			}
		</Box>
	);
};


export default FileContent;