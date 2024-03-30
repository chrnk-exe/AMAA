import React, {useEffect, useState, FC, MouseEvent, ChangeEvent} from 'react';
import {Box, Button, List, ListItemButton, ListItemIcon, ListItemText, Modal} from '@mui/material';
import {useNavigate, useParams} from 'react-router';
import Typography from '@mui/material/Typography';
import {
	useGetFileMutation,
	useGetDirectoriesMutation,
	useCreateFileMutation,
	useCreateDirectoryMutation
} from '../../../store/services/fileApiWs';
import {useAppSelector, useAppDispatch} from '../../../hooks/typedReduxHooks';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import FolderIcon from '@mui/icons-material/Folder';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import {clearFilesystem} from '../../../store/slices/dirSlice';
import {deleteFile} from '../../../store/slices/fileSlice';
import FileContent from './FileContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FilesModal from './FilesModal';
import TextField from '@mui/material/TextField';
import generateFilename from '../../../utils/genFilename';

const modalBoxStyles = {
	position: 'absolute' as const,
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	pt: 2,
	px: 4,
	pb: 3,
};

const icons = {
	'link': <ArrowRightAltIcon/>,
	'directory': <FolderIcon/>,
	'file': <FileOpenIcon/>
};

interface TabPanelProps {
	children: string;
	index: number;
	value: number;
	size: number | undefined;
}

const CustomTabPanel: FC<TabPanelProps> = (props) => {
	const {children, value, index, size, ...other} = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`filecontent-tabpanel-${index}`}
			aria-labelledby={`filecontent-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{p: 3}}>
					<FileContent data={children} size={size}/>
				</Box>
			)}
		</div>
	);
};


function a11yProps(index: number) {
	return {
		id: `filecontent-tab-${index}`,
		'aria-controls': `filecontent-tabpanel-${index}`,
	};
}

const Files = () => {
	// Tabs value
	const [value, setValue] = useState(0);
	// popup states
	const [popover, setPopover] = useState<objectType>();
	const [popoverCoords, setPopoverCoords] = useState({
		x: 0,
		y: 0
	});

	// Modal window state
	const [openModalFile, setOpenModalFile] = useState(false);
	const [openModalDirectory, setOpenModalDirectory] = useState(false);
	const [name, setName] = useState('');
	const [escapeSymbolsWarning, setWarning] = useState(true);

	// Для right-click меню имя файла, с которым надо что-то сделать.
	const [editFilename, setEditFilename] = useState('');
	// Path URL variable
	const {path} = useParams();

	const navigate = useNavigate();


	const [getDirectories] = useGetDirectoriesMutation();
	const [getFileContent] = useGetFileMutation();
	const [createFile] = useCreateFileMutation();
	const [createDirectory] = useCreateDirectoryMutation();

	const files = useAppSelector(state => state.files);
	const fileContents = useAppSelector(state => state.fileContents);
	const dispatch = useAppDispatch();


	useEffect(() => {
		dispatch(clearFilesystem());
		getDirectories(path ? path : '/');
	}, [path]);

	// Open file or folder or link
	const clickHandler = (objType: objectType | undefined, filename: string, link: string | undefined, size: number) => {
		if (objType && path) {
			const resultPath = encodeURIComponent(generateFilename(path, filename));
			if (objType === 'directory') {
				navigate(`/filesystem/${resultPath}`);
			} else if (objType === 'file') {
				if (fileContents.find(fileContent => fileContent.name === filename)) dispatch(deleteFile(filename));
				setValue(fileContents.length);
				if (size < 1000000) {
					getFileContent(decodeURIComponent(resultPath));
				} else {
					alert('File too large');
				}
			} else {
				if (link) {
					const resultLinkPath = encodeURIComponent(generateFilename(path, link));
					navigate(`/filesystem/${resultLinkPath}`);
				} else {
					alert('Some error occurred');
				}
			}
		}
	};

	// Tabs changer
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	// Tabs delete file from storage
	const handleRemoveFileContent = (filename: string) => {
		dispatch(deleteFile(filename));
	};

	// Popup on right click
	const rightClickHandler = (e: MouseEvent<HTMLDivElement>, file: Directory) => {
		e.preventDefault();
		setPopoverCoords({
			x: e.clientX,
			y: e.clientY
		});
		setPopover(file.objectType);
		setEditFilename(file.fileName);
	};

	const onFilenameInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const format = /[!@#$%^&*()+\-=[\]{};':"\\|,<>/?]+/;
		if (!format.test(e.target.value)) {
			setWarning(e.target.value === '');
			setName(e.target.value);
		}
	};

	const onCreateObjectHandler = () => {
		if (openModalFile) {
			createFile(generateFilename(path, name));
			setOpenModalFile(false);
		}
		if (openModalDirectory) {
			createDirectory(generateFilename(path, name));
			setOpenModalDirectory(false);
		}
		// Сделал с задеркой чтобы процесс не падал
		setTimeout(() => {
			dispatch(clearFilesystem());
			getDirectories(path ? path : '/');
		}, 500);
	};


	return (
		<Box display={'grid'} gridTemplateColumns={'3fr 8fr'} height={'100%'}>
			{/*Files popover with absolute position */}
			<FilesModal coords={popoverCoords} isOpen={!!popover} objectType={popover}
				onClose={() => setPopover(undefined)}
				filename={editFilename}/>
			{/*Modal window on create file*/}
			<Modal open={openModalFile || openModalDirectory} onClose={() => {
				setOpenModalFile(false);
				setOpenModalDirectory(false);
			}}>
				<Box sx={{...modalBoxStyles}}>
					<Typography mb={1}>
						Escape bad characters (like {'\'/\''} or {'\'..\''})
					</Typography>
					<Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap={1}>
						<TextField color={escapeSymbolsWarning ? 'warning' : 'primary'} label={'Name'}
								   placeholder={'Input name'} value={name}
								   onChange={onFilenameInputHandler}/>
						<Button onClick={onCreateObjectHandler} disabled={escapeSymbolsWarning} variant={'outlined'}>
							Create
						</Button>
					</Box>
				</Box>
			</Modal>

			<Box p={2} sx={{borderRight: 1, borderColor: 'divider', bgcolor: '#FFF'}}>
				<Box>
					<Typography variant={'h6'}>
						Current path: {path}
					</Typography>
					<Box mt={1} display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
						<Button onClick={() => setOpenModalFile(true)} variant={'outlined'} color="primary">Create
							file</Button>
						<Button onClick={() => setOpenModalDirectory(true)} variant={'outlined'} color="primary">Make
							directory</Button>
					</Box>
				</Box>
				<Box>
					<List>
						{files.map((file, index) => (
							<ListItemButton key={index}
								onClick={() => clickHandler(file?.objectType, file.fileName, file.link, file.size)}
								onContextMenu={(e) => rightClickHandler(e, file)}
							>
								<ListItemIcon>
									{
										file?.objectType && icons[file?.objectType]
									}
								</ListItemIcon>
								<ListItemText>{file.fileName} {file?.link && `(${file?.link})`} {file.size == 0 ? '(empty)' : `(${file.size})`}</ListItemText>
							</ListItemButton>
						))}
					</List>
				</Box>
			</Box>
			<Box ml={2} pt={2}>
				<Typography variant={'h6'}>File content</Typography>
				<Box sx={{borderBottom: 1, borderColor: 'divider'}}>
					<Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
						{
							fileContents.map((fileContent, index) => (
								<Tab key={index} wrapped label={fileContent.name} {...a11yProps(index)}
									 iconPosition={'end'}
									 icon={<IconButton
										 onClick={() => handleRemoveFileContent(fileContent.name)}><CloseIcon/></IconButton>}/>
							))
						}
					</Tabs>
				</Box>
				{
					fileContents.map((fileContent, index) => (
						<CustomTabPanel key={index} index={index} value={value}
							size={files.find(file => file.fileName === fileContent.name)?.size}>
							{fileContent.data}
						</CustomTabPanel>
					))
				}
			</Box>
		</Box>
	);
};

export default Files;