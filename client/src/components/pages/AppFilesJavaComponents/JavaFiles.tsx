import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router';
import { Box, TableBody, TableCell, TableHead, Typography, Table, TableRow, Button } from '@mui/material';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

import {
	useIsFileMutation,
	useLsMutation,
	useGetPackageInfoMutation,
	useDbQueryMutation,
	useFileExistsMutation,
	useReadFileMutation
} from '../../../store/services/javaFileApiHttp';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector, useAppDispatch } from '../../../hooks/typedReduxHooks';
import { setPackageInfo } from '../../../store/slices/javaFS/javaPackageInfo';
import { setPackagePaths } from '../../../store/slices/javaFS/packagePaths';
import { setFiles } from '../../../store/slices/javaFS/javaFiles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import StorageIcon from '@mui/icons-material/Storage';
import FileView from './FileView';
import DBView from './DBView';




const JavaFiles = () => {
	const {appIdentifier} = useParams();


	// local storage
	const [fileContent, setFileContent] = useState('');
	const [currentPath, setCurrentPath] = useState('');
	const [currentReadFile, setCurrentReadFile] = useState('');
	const [pathStack, setPathStack] = useState<string[]>([]);

	const addToStack = (path: string) => {
		setPathStack([...pathStack, path]);
	};

	const removeFromStack = () => {
		const lastElement = pathStack[pathStack.length - 1];
		setPathStack(pathStack.slice(0, -1));
		return lastElement;
	};

	// Global storage
	const currentDevice = useAppSelector(state => state.currentDevice);
	const packagePaths = useAppSelector(state => state.packagePaths);
	const javaFiles = useAppSelector(state => state.javaFiles);

	const dispatch = useAppDispatch();

	// Mutations
	const [getPackageInfo, {isLoading}] = useGetPackageInfoMutation();
	const [ls] = useLsMutation();
	const [readFile, readFileState] = useReadFileMutation();

	// For notifications
	const [open, setOpen] = React.useState(false);

	// const handleClick = () => {
	// 	setOpen(true);
	// };

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	// For file modal
	const [fileOpen, setFileOpen] = useState(false);
	const handleFileModalOpen = () => setFileOpen(true);
	const handleFileModalClose = () => setFileOpen(false);

	//For DB Modal
	const [DBOpen, setDBOpen] = useState(false);
	const handleDBModalOpen = () => setDBOpen(true);
	const handleDBModalClose = () => setDBOpen(false);

	useEffect( () => {
		const getData = async (appIdentifier: string) => {
			await getPackageInfo({ identifier: appIdentifier });
		};
		if(appIdentifier) {
			getData(appIdentifier);
		}

		return () => {
			dispatch(setFiles([]));
			dispatch(setPackagePaths([]));
			dispatch(setPackageInfo({package_name: '', package_version: '', directories: []}));
		};

	}, [appIdentifier]);

	const onSelectApplicationPath = async (path: string) => {
		setCurrentPath(path);
		addToStack(path);
		if (appIdentifier) {
			await ls({ identifier: appIdentifier, path });
		}
	};


	// Залистить директорию, то же самое что и при выборе папки приложения
	const onForwardButtonClickHandler = async (path: string) => {
		addToStack(path);
		setCurrentPath(path);
		if (appIdentifier) {
			await ls({ identifier: appIdentifier, path });
		}
	};

	// Читать файл, модалка
	const onReadButtonClickHandler = async (path: string, size: string) => {
		if(appIdentifier) {
			const fileData = await readFile({ identifier: appIdentifier, path, size: ((+size) + 1) });
			// setFileContent(fileData);
			if ('data' in fileData) {
				const buffer = Buffer.from(fileData.data.data);
				setFileContent(buffer.toString());
				setCurrentReadFile(path);
				handleFileModalOpen();
			}
		}
	};

	// Открыть как БД, затесть БД или нет
	const onDBClickHandler = (path: string) => {
		setCurrentReadFile(path);
		handleDBModalOpen();
	};

	// Подняться вверх
	const onBackButtonClickHandler = async () => {
		removeFromStack();
		const lastPath = pathStack[pathStack.length - 2];
		if (appIdentifier) {
			await ls({ identifier: appIdentifier, path: lastPath });
			setCurrentPath(lastPath);
		}
	};


	return (
		<Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} >
			{/*Header*/}
			<Box>
				<Typography variant={'h3'}>
					{currentDevice} - {appIdentifier}
				</Typography>
			</Box>
			{/*Main*/}
			<Box sx={{maxWidth: '80%'}}>
				<Typography>
					Session status: {}
				</Typography>

				<Typography variant={'h6'}>
					Текущий путь: {currentPath}
				</Typography>

				{isLoading && <CircularProgress/>}

				<Typography variant={'h5'}>
					Директории с файлами приложения:
				</Typography>

				<Table sx={{bgcolor: '#FFFFFF', my: 2, borderRadius:2}}>
					<TableHead>
						<TableCell>Имя файла</TableCell>
						<TableCell>Последнее изменение</TableCell>
						<TableCell>Размер</TableCell>
						<TableCell>Флаги</TableCell>
						<TableCell></TableCell>
					</TableHead>
					<TableBody>
						{
							packagePaths.map((packageDirectory, index) => (
								<TableRow key={index}>
									<TableCell>{packageDirectory.path}</TableCell>
									<TableCell>{new Date(+packageDirectory.lastModified).toLocaleString()}</TableCell>
									<TableCell>{packageDirectory.size} B</TableCell>
									<TableCell>
										{packageDirectory.isDirectory && (<Typography>Directory</Typography>)}
										{packageDirectory.isFile && <Typography>File</Typography>}
										{packageDirectory.isHidden && <Typography>Hidden</Typography>}
										{packageDirectory.readable ? 'r' : '-'}{packageDirectory.writeable ? 'w' : '-'}{packageDirectory.executable ? 'x' : '-'}
									</TableCell>
									<TableCell>
										<Button variant={'contained'} onClick={() => onSelectApplicationPath(packageDirectory.path)}>
											Select
										</Button>
									</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>

				<Typography variant={'h5'}>
					Файлы/Директории:
				</Typography>

				<Table sx={{bgcolor: '#FFFFFF', my: 1, borderRadius:2}}>
					<TableHead>
						<TableCell>Имя файла</TableCell>
						<TableCell>Последнее изменение</TableCell>
						<TableCell>Размер</TableCell>
						<TableCell>Флаги</TableCell>
						<TableCell><Button onClick={() => onBackButtonClickHandler()} startIcon={<ArrowBackIcon/>}>Назад</Button></TableCell>
					</TableHead>
					<TableBody>
						{
							javaFiles.map(file => (
								<TableRow key={file.path}>
									<TableCell>{file.path}</TableCell>
									<TableCell>{new Date(+file.lastModified).toLocaleString()}</TableCell>
									<TableCell>{file.size} B</TableCell>
									<TableCell>
										{file.isDirectory && (<Typography>Directory</Typography>)}
										{file.isFile && <Typography>File</Typography>}
										{file.isHidden && <Typography>Hidden</Typography>}
										{file.readable ? 'r' : '-'}{file.writeable ? 'w' : '-'}{file.executable ? 'x' : '-'}
									</TableCell>
									<TableCell>
										{
											file.isDirectory
												? <Button
													onClick={() => onForwardButtonClickHandler(file.path)}
													variant={'contained'}
													startIcon={<ArrowForwardIcon/>}/>
												: <Box display={'flex'} gap={2}>
													<Button
														onClick={() => onReadButtonClickHandler(file.path, file.size.toString())}
														variant={'contained'}
														startIcon={<ReadMoreIcon/>}/>
													<Button
														onClick={() => onDBClickHandler(file.path)}
														variant={'contained'}
														startIcon={<StorageIcon/>}/>

												</Box>
										}

									</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</Box>

			{/*	Notification and Modal windows */}
			<Snackbar
				open={open}
				autoHideDuration={5000}
				onClose={handleClose}
				message="Ошибка, frida потеряла соединение, попробуйте через 2-5 секунд"
			/>

			<FileView
				open={fileOpen}
				data={fileContent}
				// saveChanges={() => console.log('???')}
				handleClose={handleFileModalClose}
				identifier={appIdentifier}
				filename={currentReadFile}/>

			<DBView open={DBOpen} handleClose={handleDBModalClose} filename={currentReadFile} identifier={appIdentifier}/>
		</Box>);
};


export default JavaFiles;