import React, {FC} from 'react';
import Box from '@mui/material/Box';
import {List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EditIcon from '@mui/icons-material/Edit';
import {useParams} from 'react-router';
import {useGetFileMutation, useDeleteFileMutation} from '../../../../store/services/fileApiWs';
import {useAppDispatch, useAppSelector} from '../../../../hooks/typedReduxHooks';
import {deleteFile} from '../../../../store/slices/lsFS/fileSlice';
import {deleteFileOrDirectory} from '../../../../store/slices/lsFS/dirSlice';
import generateFilename from '../../../../utils/genFilename';

const downloadb64File = (filename: string, data: string) => {
	try {
		const saveFile = new File([atob(data)], filename);
		const link = document.createElement('a');
		link.href = URL.createObjectURL(saveFile);
		link.download = filename;
		link.click();
		URL.revokeObjectURL(link.href);
	} catch (err) {
		alert('Error :(');
		return;
	}
};

// * modify file (rm + echo {content} >> file)

interface props {
	filename: string;
	onClose: () => void;
}

const FileMenu: FC<props> = ({filename, onClose}) => {

	const {path} = useParams();
	const fileContents = useAppSelector(state => state.fileContents);
	const [getFileContent] = useGetFileMutation();
	const [deleteRemoteFile] = useDeleteFileMutation();
	const dispatch = useAppDispatch();


	const onOpenFileHandler = () => {
		if (fileContents.find(fileContent => fileContent.name === filename)) dispatch(deleteFile(filename));
		getFileContent(generateFilename(path, filename));
	};

	const onRemoveFileHandler = () => {
		dispatch(deleteFile(filename));
		dispatch(deleteFileOrDirectory(filename));
		deleteRemoteFile(generateFilename(path, filename));
	};

	const onDownloadFileHandler = () => {
		const file = fileContents.find(file => file.name === filename);
		if (file) {
			downloadb64File(filename, file.data);
		} else {
			getFileContent(generateFilename(path, filename));
			setTimeout(() => {
				const file = fileContents.find(file => file.name === filename);
				if (file) {
					downloadb64File(filename, file.data);
				} else {
					alert('Open file before downloading, its too big');
				}
			}, 1500);
		}
	};

	const onRenameFileHandler = () => {
		alert('Rename file');
	};

	// Открыть текстовый эдитор, где слева - нон эдитабле оригинал, а справа - эдитабл
	const onEditFileHandler = () => {
		alert('Edit file');
	};

	const menuItems = [{
		onClickFunction: onOpenFileHandler,
		text: 'Open',
		icon: <FolderOpenIcon/>
	}, {
		onClickFunction: onDownloadFileHandler,
		text: 'Download',
		icon: <DownloadIcon sx={{color: 'orange'}}/>,
		color: 'orange'
	}, {
		onClickFunction: onEditFileHandler,
		text: 'Edit',
		icon: <EditIcon/>
	}, {
		onClickFunction: onRenameFileHandler,
		text: 'Rename',
		icon: <DriveFileRenameOutlineIcon/>
	}, {
		onClickFunction: onRemoveFileHandler,
		text: 'Remove',
		icon: <ClearIcon sx={{color: 'red'}}/>,
		color: 'red'
	}];

	return (
		<Box p={1} onClick={onClose}>
			<List>
				{
					menuItems.map((menuItem, index) => (
						<ListItemButton key={index} sx={{color: menuItem.color}} onClick={menuItem.onClickFunction}>
							<ListItemIcon>{menuItem.icon}</ListItemIcon>
							<ListItemText>{menuItem.text}</ListItemText>
						</ListItemButton>
					))
				}
			</List>
		</Box>
	);
};

export default FileMenu;