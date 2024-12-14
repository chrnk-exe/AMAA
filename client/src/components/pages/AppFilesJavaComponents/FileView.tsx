import React, {type FC, useState, useEffect} from 'react';
import { Box, Modal, Typography, Button,TextField } from '@mui/material';
import ReactJson from 'react-json-view';
import XMLViewer from 'react-xml-viewer';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useEditFileMutation } from '../../../store/services/javaFileApiHttp';


const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%',
	height: '80%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

interface props {
	open: boolean,
	data: string,
	// saveChanges: (data: string) => void,
	handleClose: () => void,
	filename: string,
	identifier: string | undefined
}

const FileView: FC<props> = ({open, data, handleClose, filename, identifier}) => {
	const extension = filename.split('.')[filename.split('.').length - 1];
	const [viewType, setViewType] = useState<'XML' | 'JSON' | 'RAW'>(extension === 'json' ? 'JSON' : extension === 'xml'? 'XML' : 'RAW');
	const [fileData, setFileData] = useState(data);

	const [editFile] = useEditFileMutation();

	const handleViewType = (
		event: React.MouseEvent<HTMLElement>,
		newViewType: 'RAW' | 'XML' | 'JSON'
	) => {
		setViewType(newViewType);
	};

	useEffect(() => {
		setFileData(data);
	}, [data]);

	const saveChanges = (newContent: string) => {
		if (identifier) {
			editFile({identifier, path: filename, newContent});
		}
	};

	return (
		<Modal
			open={open}
			onClose={() => {
				handleClose();
				setFileData(data);
			}}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style} display={'flex'} flexDirection={'column'}>
				<Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Имя файла: {filename}
					</Typography>
				</Box>
				<Box display={'flex'} gap={1}>
					<ToggleButtonGroup
						value={viewType}
						exclusive
						onChange={handleViewType}
						aria-label="text alignment"
						sx={{ mb: 1, mt: 1 }}
					>
						<ToggleButton value="RAW" aria-label="left aligned">
							<Typography>RAW</Typography>
						</ToggleButton>
						<ToggleButton disabled={extension !== 'json' || data !== fileData} value="JSON" aria-label="centered">
							<Typography>JSON</Typography>
						</ToggleButton>
						<ToggleButton disabled={extension !== 'xml' || data !== fileData} value="XML" aria-label="right aligned">
							<Typography>XML</Typography>
						</ToggleButton>
					</ToggleButtonGroup>
					<Button
						variant={'outlined'}
						onClick ={() => saveChanges(fileData)}
						sx={{
							lineHeight: 0,
							paddingBlock: 0
						}}>
						Сохранить
					</Button>
				</Box>


				{
					viewType === 'RAW'
						? <TextField
							multiline
							value={fileData}
							onChange={e => setFileData(e.target.value)}
							sx={{overflowY: 'scroll'}}/>
						: viewType === 'JSON'
							? <ReactJson src={JSON.parse(data)}/>
							: <XMLViewer xml={data}/>

				}
			</Box>
		</Modal>
	);
};

export default FileView;